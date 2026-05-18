import { z } from "zod";

export const createAddressSchema = z.object({
  line1: z.string().min(1, "Street address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Region is required"),
  zipCode: z.string().min(1, "ZIP/Postal code is required"),
  countryCode: z.string()
    .length(2, "Country code must be exactly a 2-character ISO alpha-2 code")
    .transform((val) => val.toUpperCase()),
  isDefault: z.boolean().optional().default(false)
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
