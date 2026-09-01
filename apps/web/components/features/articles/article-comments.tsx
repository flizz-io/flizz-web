import { MessageSquare } from 'lucide-react';

import { Reveal } from '@/components/snippets/reveal/reveal';
import type { ArticleComment } from '@/types/engagement';
import { formatArticleDate } from '@/utils/articles';
import { getInitials } from '@/utils/team';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

interface ArticleCommentsProps {
	comments: ArticleComment[];
	className?: string;
}

/**
 * Designed, not wired. Nothing here posts, and the form is disabled rather
 * than left live to collect input that would be silently discarded — a
 * comment box that accepts text and loses it is worse than one that says it
 * is not open yet.
 *
 * Replies nest one level only. A comment thread is a conversation, not a tree,
 * and unbounded nesting is unreadable on a phone.
 *
 * TODO: connect to the Articles API at Stage 10 — posting, moderation state,
 * and pagination all land there.
 */
export function ArticleComments({ comments, className }: ArticleCommentsProps) {
	return (
		<section
			className={cn(
				'border-t border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-2xl">
				<Reveal>
					<h2 className="flex items-baseline gap-3 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
						Comments
						<span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
							{comments.length}
						</span>
					</h2>
				</Reveal>

				{/* Not yet accepting input — say so rather than imply otherwise. */}
				<Reveal
					delay={80}
					className="mt-8 rounded-lg border border-border bg-card/40 p-5"
				>
					<Textarea
						disabled
						rows={3}
						placeholder="Comments open when the site goes live."
						aria-label="Write a comment"
						className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
					/>
					<div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
						<p className="font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
							Not open yet
						</p>
						<Button
							size="sm"
							disabled
						>
							Post comment
						</Button>
					</div>
				</Reveal>

				{comments.length ? (
					<ul className="mt-10 space-y-8">
						{comments.map((comment, index) => (
							<Reveal
								key={comment.id}
								delay={index * 70}
							>
								<li>
									<CommentBody comment={comment} />

									{comment.replies?.length ? (
										<ul className="mt-6 space-y-6 border-l border-border pl-5 sm:pl-7">
											{comment.replies.map((reply) => (
												<li key={reply.id}>
													<CommentBody
														comment={reply}
														isReply
													/>
												</li>
											))}
										</ul>
									) : null}
								</li>
							</Reveal>
						))}
					</ul>
				) : (
					<Reveal
						delay={80}
						className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-14 text-center"
					>
						<MessageSquare className="size-5 text-muted-foreground" />
						<p className="font-heading text-base font-semibold text-foreground">
							No comments yet
						</p>
						<p className="max-w-xs text-sm text-pretty text-muted-foreground">
							Be the first to say something once comments open.
						</p>
					</Reveal>
				)}
			</div>
		</section>
	);
}

function CommentBody({
	comment,
	isReply
}: {
	comment: ArticleComment;
	isReply?: boolean;
}) {
	return (
		<article className="flex gap-4">
			<span
				aria-hidden
				className={cn(
					'flex shrink-0 items-center justify-center rounded-full border border-border bg-card font-heading font-semibold text-foreground/40',
					isReply ? 'size-8 text-[0.65rem]' : 'size-10 text-xs'
				)}
			>
				{getInitials(comment.author)}
			</span>

			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<p className="font-heading text-sm font-semibold tracking-tight text-foreground">
						{comment.author}
					</p>
					<time
						dateTime={comment.postedAt}
						className="font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase"
					>
						{formatArticleDate(comment.postedAt)}
					</time>
				</div>

				{comment.role ? (
					<p className="mt-0.5 font-mono text-[0.6rem] tracking-[0.18em] text-primary uppercase">
						{comment.role}
					</p>
				) : null}

				<p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
					{comment.body}
				</p>
			</div>
		</article>
	);
}
