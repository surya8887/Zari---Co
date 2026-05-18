import React, { useState } from "react";
import { MoreHorizontal, Star, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { EmptyState } from "./EmptyState";

interface Review {
  id: number;
  rating: number;
  text: string;
  author: string;
}

export const RecentReviewsCard: React.FC = () => {
  const { searchQuery, products } = useAppStore();
  const [replyReviewId, setReplyReviewId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const reviews: Review[] = products.map((p, index) => ({
    id: index + 1,
    rating: index % 3 === 0 ? 4 : 5,
    text: index % 2 === 0 
      ? `This ${p.name.toLowerCase()} is absolutely stunning and the jewelry craftsmanship is spectacular. I got so many compliments.`
      : `Very high quality luxury ${p.name.toLowerCase()}. Highly recommend Zari & Co to everyone who loves fine luxury jewelry.`,
    author: index % 2 === 0 ? "Emily R." : "Marcus K."
  }));

  // Filter reviews based on search query
  const filteredReviews = reviews.filter(r => 
    r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReplySubmit = (e: React.FormEvent, author: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const toastId = toast.loading(`Submitting response to ${author}...`);

    setTimeout(() => {
      toast.success(`Reply successfully posted to ${author}! ✨`, {
        id: toastId,
        description: `Posted response: "${replyText.substring(0, 30)}..."`,
        icon: <Sparkles size={14} className="text-primary animate-pulse" />
      });
      setReplyReviewId(null);
      setReplyText("");
    }, 1000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,168,128,0.03)] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-border/50 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">Recent Reviews</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Customer feedback and star ratings</p>
          </div>
          <button 
            onClick={() => toast.info("Accessing review management portal.")}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="space-y-4 mt-3">
          {filteredReviews.length === 0 ? (
            <div className="py-6">
              <EmptyState 
                title="No Reviews Registered"
                description="Database does not contain any catalog item reviews. Reviews are generated dynamically as you insert products."
                icon={<Star size={18} className="opacity-50 text-muted-foreground" />}
              />
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className="space-y-2 border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                {/* Gold star rating stars */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < review.rating ? "fill-primary text-primary" : "text-muted"} 
                      />
                    ))}
                  </div>

                  {/* Quick Reply button */}
                  {replyReviewId !== review.id && (
                    <button 
                      onClick={() => setReplyReviewId(review.id)}
                      className="text-[10px] text-primary hover:text-primary-foreground font-bold flex items-center gap-1 cursor-pointer select-none hover:underline"
                    >
                      <MessageSquare size={10} />
                      Quick Reply
                    </button>
                  )}
                </div>
                
                {/* Testimonial text block */}
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "{review.text}"
                </p>
                
                {/* Author name */}
                <p className="text-[9px] text-primary/75 tracking-widest uppercase font-semibold">
                  — {review.author}
                </p>

                {/* Reply panel form */}
                {replyReviewId === review.id && (
                  <form 
                    onSubmit={(e) => handleReplySubmit(e, review.author)}
                    className="mt-2.5 bg-secondary/35 border border-border p-2.5 rounded-lg space-y-2 animate-in slide-in-from-top-1 duration-150"
                  >
                    <div className="flex justify-between items-center border-b border-border/40 pb-1 mb-1">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                        Drafting Reply to {review.author}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setReplyReviewId(null)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                    
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your official Zari & Co client response..."
                      className="w-full min-h-[60px] p-2 text-xs border border-border bg-[#0d0f14]/50 rounded text-foreground focus:outline-none focus:border-primary/50 text-left font-sans"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="bg-primary text-[#090a0f] text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1 hover:bg-primary/95 disabled:opacity-40 cursor-pointer select-none transition-colors"
                      >
                        <Send size={8} />
                        Post Response
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
