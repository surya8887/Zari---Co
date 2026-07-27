# Production Deployment Guide: Zari & Co on AWS

This guide details the step-by-step procedure to deploy the **Zari & Co** application stack to AWS. The stack consists of:
1. **Frontend (Vite + Nginx)**: React app running on port `3000`.
2. **Admin Panel (Vite + Nginx)**: React app running on port `3001`.
3. **Backend API (Node + Express + Prisma)**: REST API running on port `5000`.
4. **Database (Amazon RDS PostgreSQL)**: Relational database running on port `5432`.

We will deploy the services using **AWS ECS Fargate** (serverless container hosting), **Amazon ECR** (Elastic Container Registry), **Application Load Balancer (ALB)** (routing and SSL termination), and **Amazon RDS** (managed database).

---

## Architecture Overview

```mermaid
graph TD
    Client[Client Browser] -->|Port 443 HTTPS| ALB[Application Load Balancer]
    
    %% ALB routing rules
    ALB -->|Host: api.yourdomain.com or Path: /api/*| ECS_Backend[ECS Service: Backend Port 5000]
    ALB -->|Host: admin.yourdomain.com| ECS_Admin[ECS Service: Admin Port 3001]
    ALB -->|Default Rule / Host: yourdomain.com| ECS_Frontend[ECS Service: Frontend Port 3000]
    
    %% Backend integrations
    ECS_Backend -->|Port 5432| RDS[(Amazon RDS PostgreSQL)]
    ECS_Backend -->|Media Assets| Cloudinary[Cloudinary CDN]
    ECS_Backend -->|Authentication| Firebase[Firebase Admin SDK]
    
    %% ECS Configuration
    SecretsManager[AWS Secrets Manager] -.->|Injects Env Vars at launch| ECS_Backend
    ECR[Amazon ECR] -.->|Pulls Docker Images| ECS_Backend & ECS_Admin & ECS_Frontend
```

---

## Step 1: Set Up VPC & Network Infrastructure

For production security, database instances and container tasks should reside in private subnets and only be reachable from the Load Balancer.

1. **Open AWS VPC Console**: Go to **VPC Wizard** -> Select **VPC and more**.
2. **Configure Settings**:
   - **Name tag**: `zari-co-vpc`
   - **IPv4 CIDR block**: `10.0.0.0/16`
   - **Number of Availability Zones (AZs)**: `2` (e.g., `us-east-1a` and `us-east-1b`)
   - **Number of Public Subnets**: `2` (e.g., `10.0.1.0/24`, `10.0.2.0/24`)
   - **Number of Private Subnets**: `2` (e.g., `10.0.11.0/24`, `10.0.12.0/24`)
   - **NAT Gateways ($)**: `1 per AZ` (recommended for redundancy) or `1` (cost-saving). NAT Gateway allows containers in private subnets to pull npm dependencies or connect to external APIs (Firebase/Cloudinary) while remaining inaccessible from the public internet.
   - **VPC Endpoints**: None (or S3 Gateway Endpoint to save cost).
3. **Click Create VPC**.

### Define Security Groups (SGs)
Create three separate Security Groups under the VPC `zari-co-vpc`:

1. **`zari-co-alb-sg` (Load Balancer SG)**:
   - **Inbound Rules**:
     - `HTTP` (Port 80) from `0.0.0.0/0` (Anywhere)
     - `HTTPS` (Port 443) from `0.0.0.0/0` (Anywhere)
   - **Outbound Rules**: All traffic (`0.0.0.0/0`).

2. **`zari-co-ecs-sg` (ECS Container Service SG)**:
   - **Inbound Rules**:
     - `Custom TCP` (Ports `3000`, `3001`, `5000`) from Source = `zari-co-alb-sg` (restrict access *only* to traffic coming from the ALB).
   - **Outbound Rules**: All traffic (`0.0.0.0/0`).

3. **`zari-co-rds-sg` (RDS Database SG)**:
   - **Inbound Rules**:
     - `PostgreSQL` (Port `5432`) from Source = `zari-co-ecs-sg` (restrict database access *only* to the backend ECS service).
   - **Outbound Rules**: None.

---

## Step 2: Create Amazon RDS PostgreSQL Instance

1. **Create DB Subnet Group**:
   - Go to **RDS Console** -> **Subnet Groups** -> **Create DB Subnet Group**.
   - Name: `zari-co-db-subnet-group`
   - Select VPC: `zari-co-vpc`
   - Add all subnets associated with your **Private Subnets** (created in Step 1).
2. **Launch RDS Instance**:
   - Go to **RDS** -> **Databases** -> **Create Database**.
   - **Engine**: PostgreSQL (Choose v15.x to match your local setup).
   - **Templates**: **Production** (for Multi-AZ redundancy) or **Dev/Test** (for single AZ).
   - **Settings**:
     - **DB Instance Identifier**: `zari-co-db`
     - **Master Username**: `surya` (or your preferred admin user)
     - **Master Password**: Choose a strong password.
   - **Instance configuration**: `db.t4g.micro` or `db.t4g.small` (sufficient for start).
   - **Storage**: SSD (gp3), 20 GiB (enable Autoscaling).
   - **Connectivity**:
     - **Compute resource**: Don't connect to an EC2 instance.
     - **Network**: Choose `zari-co-vpc`.
     - **DB Subnet Group**: Select `zari-co-db-subnet-group`.
     - **Public Access**: **No** (Critical for security).
     - **Existing VPC Security Groups**: Select `zari-co-rds-sg` (remove `default` SG).
   - **Database Options**:
     - **Initial database name**: `Tanishq`
   - Click **Create Database**. Note the generated **Endpoint URL** once created.

---

## Step 3: Configure AWS Secrets Manager

To securely store backend environment configurations:

1. Go to **AWS Secrets Manager** -> **Store a new secret**.
2. **Secret type**: **Other type of secret**.
3. **Key/Value Pairs**: Enter your production backend secrets (from your `.env` file):
   - `DATABASE_URL` = `postgresql://surya:<your-rds-password>@<your-rds-endpoint>:5432/Tanishq?schema=public`
   - `ACCESS_TOKEN_SECRET` = `[Random Secure String]`
   - `REFRESH_TOKEN_SECRET` = `[Random Secure String]`
   - `ACCESS_TOKEN_EXPIRES` = `15m`
   - `REFRESH_TOKEN_EXPIRES` = `7d`
   - `CLOUDINARY_CLOUD_NAME` = `dzeaqx1oh`
   - `CLOUDINARY_API_KEY` = `649777371819397`
   - `CLOUDINARY_API_SECRET` = `[Your Cloudinary Secret]`
   - `GOOGLE_CLIENT_ID` = `[Your Google OAuth Client ID]`
   - `FIREBASE_API_KEY` = `AIzaSyDUMXBduXbTMJMtHaIBlfXszl26s6uMwEA`
   - `FIREBASE_AUTH_DOMAIN` = `blog-36fa7.firebaseapp.com`
   - `FIREBASE_PROJECT_ID` = `blog-36fa7`
   - `FIREBASE_STORAGE_BUCKET` = `blog-36fa7.firebasestorage.app`
   - `FIREBASE_MESSAGING_SENDER_ID` = `883952637167`
   - `FIREBASE_APP_ID` = `1:883952637167:web:51520cecbc2d5a0b5fb71a`
   - `FIREBASE_MEASUREMENT_ID` = `G-HBM4QB6WLY`
   - `FIREBASE_SERVICE_ACCOUNT` = `[Paste the entire JSON string of service account key]`
4. **Secret name**: Name it `zari-co/backend/production`.
5. Click **Store secret** and copy the **Secret ARN**.

---

## Step 4: Setup IAM Roles

ECS needs permissions to pull images from ECR and read secrets from AWS Secrets Manager.

1. Go to **IAM Console** -> **Roles** -> **Create Role**.
2. **Trusted Entity**: **AWS Service** -> Choose **Elastic Container Service** -> Select **ECS Task** -> Click **Next**.
3. **Attach Permissions Policies**:
   - Search and select `AmazonECSTaskExecutionRolePolicy` (gives basic ECR pull and CloudWatch logging permissions).
4. **Add Custom Policy for Secrets Manager**:
   - Click **Create Policy** (opens in a new tab).
   - Select **JSON** tab and paste the following:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "secretsmanager:GetSecretValue"
           ],
           "Resource": [
             "arn:aws:secretsmanager:<region>:<account-id>:secret:zari-co/backend/production-*"
           ]
         }
       ]
     }
     ```
   - Name this policy `zari-co-secrets-policy` and save it.
   - Go back to your Role creation tab, refresh, and attach `zari-co-secrets-policy` to the role.
5. **Name the Role**: `zari-co-ecs-execution-role` and click **Create Role**.

---

## Step 5: Push Containers to Amazon ECR

1. Go to **Amazon ECR Console** -> **Create Repository** (Private).
   - Create one repository named `zario_website` to house all the tagged service images.
2. **Authenticate Local Terminal to ECR**:
   Run this command in your local machine's terminal:
   ```bash
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 899928294562.dkr.ecr.ap-south-1.amazonaws.com
   ```
3. **Build & Push Backend**:
   ```bash
   docker build -t zari-co-backend ./backend
   docker tag zari-co-backend:latest 899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:backend
   docker push 899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:backend
   ```
4. **Build & Push Frontend (Injecting Production URL)**:
   Since Vite embeds env vars during compile-time, pass the URL of your load balancer API endpoint (e.g. `https://api.yourdomain.com/api/v1` or `https://yourdomain.com/api/v1`):
   ```bash
   docker build --build-arg VITE_API_URL=https://api.yourdomain.com/api/v1 -t zari-co-frontend ./frontend
   docker tag zari-co-frontend:latest 899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:frontend
   docker push 899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:frontend
   ```
5. **Build & Push Admin (Injecting Production URL)**:
   ```bash
   docker build --build-arg VITE_API_URL=https://api.yourdomain.com/api/v1 -t zari-co-admin ./admin
   docker tag zari-co-admin:latest 899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:admin
   docker push 899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:admin
   ```

---

## Step 6: Provision ALB & Configure Target Groups

An Application Load Balancer distributes HTTP requests to the active containers.

### Create 3 Target Groups
Go to **EC2 Console** -> **Target Groups** -> **Create Target Group**:

1. **`tg-zari-co-frontend`**:
   - Target type: **IP addresses** (Required for ECS Fargate).
   - Protocol: `HTTP` | Port: `3000` | VPC: `zari-co-vpc`.
   - Health Check Path: `/` | Interval: 30s.
2. **`tg-zari-co-admin`**:
   - Target type: **IP addresses**.
   - Protocol: `HTTP` | Port: `3001` | VPC: `zari-co-vpc`.
   - Health Check Path: `/` | Interval: 30s.
3. **`tg-zari-co-backend`**:
   - Target type: **IP addresses**.
   - Protocol: `HTTP` | Port: `5000` | VPC: `zari-co-vpc`.
   - Health Check Path: `/health` (Must match the Backend Express check path) | Interval: 15s.

### Create the ALB
Go to **EC2 Console** -> **Load Balancers** -> **Create Load Balancer** -> **Application Load Balancer**:
- **Name**: `zari-co-alb`
- **Scheme**: Internet-facing.
- **IP address type**: IPv4.
- **Network mapping**: Select `zari-co-vpc` and check the checkboxes for the **Public Subnets** in both AZs.
- **Security Groups**: Select `zari-co-alb-sg`.
- **Listeners and routing**:
  - Add Listener: **HTTPS** (Port `443`) -> Forward to `tg-zari-co-frontend`.
  - Under **Secure listener settings**, select your SSL certificate from **AWS Certificate Manager (ACM)** (Make sure you generated a wildcard certificate, e.g., `yourdomain.com` and `*.yourdomain.com`).
- **Create Load Balancer**.

### Set Up Routing Rules on ALB
Go to the **Listeners** tab of `zari-co-alb` -> Click **View/edit rules** on the HTTPS listener:

Configure rules in this exact order:
1. **Rule 1 (Backend Host)**:
   - IF **Host Header** is `api.yourdomain.com` (or Path is `/api/*`)
   - THEN **Forward to** `tg-zari-co-backend`.
2. **Rule 2 (Admin Host)**:
   - IF **Host Header** is `admin.yourdomain.com`
   - THEN **Forward to** `tg-zari-co-admin`.
3. **Default Rule**:
   - IF no other rules match
   - THEN **Forward to** `tg-zari-co-frontend`.

*Configure a Port 80 HTTP Listener to redirect HTTP requests to Port 443 HTTPS for automated security.*

---

## Step 7: Create ECS Task Definitions

Create a Task Definition for each container.

1. Go to **ECS Console** -> **Task Definitions** -> **Create new Task Definition (Fargate)**.

### A. Backend Task Definition
- **Task family**: `zari-co-backend-task`
- **Infrastructure requirements**: AWS Fargate.
- **Operating system/Architecture**: Linux/X86_64.
- **Task Size**: CPU = `0.5 vCPU`, Memory = `1 GB`.
- **Task Execution Role**: Select `zari-co-ecs-execution-role`.
- **Task Role**: Select `zari-co-ecs-execution-role` (or none if task does not call AWS services).
- **Container Details**:
  - **Name**: `backend`
  - **Image URI**: `899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:backend`
  - **Port mappings**: Container Port `5000` | Protocol `TCP` | App Protocol `HTTP`.
  - **Environment variables (Static)**:
    - `PORT`: `5000`
    - `NODE_ENV`: `production`
  - **Environment variables (Secrets from Secrets Manager)**:
    Under **Environment variables**, click **Add** and toggle value type to **ValueFrom**. Map each key to its secret ARN suffix:
    - Key: `DATABASE_URL` -> ValueFrom: `arn:aws:secretsmanager:<region>:<account-id>:secret:zari-co/backend/production:DATABASE_URL::`
    - Key: `ACCESS_TOKEN_SECRET` -> ValueFrom: `arn:aws:secretsmanager:<region>:<account-id>:secret:zari-co/backend/production:ACCESS_TOKEN_SECRET::`
    - Key: `REFRESH_TOKEN_SECRET` -> ValueFrom: `arn:aws:secretsmanager:<region>:<account-id>:secret:zari-co/backend/production:REFRESH_TOKEN_SECRET::`
    - Key: `CLOUDINARY_API_SECRET` -> ValueFrom: `arn:aws:secretsmanager:<region>:<account-id>:secret:zari-co/backend/production:CLOUDINARY_API_SECRET::`
    - Key: `FIREBASE_SERVICE_ACCOUNT` -> ValueFrom: `arn:aws:secretsmanager:<region>:<account-id>:secret:zari-co/backend/production:FIREBASE_SERVICE_ACCOUNT::`
    - *(Repeat for other keys as needed)*
  - **Log Configuration**: Enable AWS Logs (CloudWatch) for easy debugging.

### B. Frontend Task Definition
- **Task family**: `zari-co-frontend-task`
- **Infrastructure requirements**: AWS Fargate.
- **Task Size**: CPU = `0.25 vCPU`, Memory = `0.5 GB`.
- **Container Details**:
  - **Name**: `frontend`
  - **Image URI**: `899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:frontend`
  - **Port mappings**: Container Port `3000` | Protocol `TCP`.
  - **Log Configuration**: Enable CloudWatch.

### C. Admin Task Definition
- **Task family**: `zari-co-admin-task`
- **Infrastructure requirements**: AWS Fargate.
- **Task Size**: CPU = `0.25 vCPU`, Memory = `0.5 GB`.
- **Container Details**:
  - **Name**: `admin`
  - **Image URI**: `899928294562.dkr.ecr.ap-south-1.amazonaws.com/zario_website:admin`
  - **Port mappings**: Container Port `3001` | Protocol `TCP`.
  - **Log Configuration**: Enable CloudWatch.

---

## Step 8: Run Database Migrations on AWS

Before starting services, we must initialize and run Prisma migrations. Because the RDS database sits inside private subnets, you cannot connect from your local PC. Instead, run a **one-off ECS task** inside the private subnet:

Use the AWS CLI to run a task using your backend task definition, overriding the command to run migrations:

```bash
aws ecs run-task \
  --cluster zari-co-cluster \
  --task-definition zari-co-backend-task \
  --launch-type FARGATE \
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["<private-subnet-id-1>", "<private-subnet-id-2>"],
      "securityGroups": ["<zari-co-ecs-sg>"],
      "assignPublicIp": "DISABLED"
    }
  }' \
  --overrides '{
    "containerOverrides": [
      {
        "name": "backend",
        "command": ["npx", "prisma", "migrate", "deploy"]
      }
    ]
  }'
```

*Verify the CloudWatch logs for this task run to ensure the migrations completed successfully.*

---

## Step 9: Create ECS Cluster & Services

1. **Create ECS Cluster**:
   - Go to **ECS Console** -> **Clusters** -> **Create Cluster**.
   - Cluster Name: `zari-co-cluster`.
   - Infrastructure: Check **AWS Fargate (serverless)**.
   - Click **Create**.

2. **Deploy the Services**:
   Inside the `zari-co-cluster`, create three services (one for Backend, Admin, and Frontend):

   For each service, click **Create**:
   - **Compute configuration**: Fargate.
   - **Application type**: Service.
   - **Task Family**: Select the respective task definition (`zari-co-backend-task`, `zari-co-frontend-task`, or `zari-co-admin-task`).
   - **Service Name**: `zari-co-backend-service` (or frontend/admin).
   - **Desired Tasks**: `2` (Highly recommended for zero-downtime rolling updates and high availability).
   - **Networking**:
     - **VPC**: `zari-co-vpc`.
     - **Subnets**: Select **Private Subnets** only.
     - **Security Groups**: Select `zari-co-ecs-sg`.
     - **Public IP**: **DISABLED** (They sit behind the ALB, so they don't need a public IP).
   - **Load Balancing**:
     - **Load balancer type**: Application Load Balancer.
     - **Load balancer name**: `zari-co-alb`.
     - **Container to load balance**: Choose your service's container name.
     - **Target Group**: Select the corresponding preconfigured target group (`tg-zari-co-backend`, `tg-zari-co-frontend`, or `tg-zari-co-admin`).
   - Click **Create**.

---

## Step 10: Point DNS in Route 53

1. Go to **Route 53 Console** -> **Hosted Zones** -> Select your domain name.
2. **Create A Records**:
   - **Name**: `yourdomain.com` (Frontend)
     - Toggle **Alias** to ON.
     - Route traffic to: **Alias to Application Load Balancer**.
     - Choose region and select `zari-co-alb`.
   - **Name**: `admin.yourdomain.com` (Admin Panel)
     - Toggle **Alias** to ON.
     - Route traffic to: Same ALB.
   - **Name**: `api.yourdomain.com` (Backend API)
     - Toggle **Alias** to ON.
     - Route traffic to: Same ALB.

Once DNS propagates, your containers are live, fully secured behind HTTPS, and connected to your production PostgreSQL database!
