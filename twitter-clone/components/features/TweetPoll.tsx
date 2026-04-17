import { useMutation, useQueryClient } from "@tanstack/react-query"
import { votePoll } from "@/utils/tweet"


export function TweetPoll({ options, totalVotes, expiresAt, tweetId }: any) {
  const queryClient = useQueryClient()

  const voteMutation = useMutation({
    mutationFn: (index: number) => votePoll(tweetId, index),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweets'] })
    }
  })

  return (
    <div className="mt-3 border border-border rounded-2xl p-3 flex flex-col gap-2">
      {options.map((option, i) => {
        const pct =
          totalVotes === 0
            ? 0
            : Math.round((option.votes / totalVotes) * 100)

        return (
          <button
            key={option.label}
            onClick={() => voteMutation.mutate(i)}
            className="relative h-9 rounded-full overflow-hidden bg-bg2"
          >
            <div
              className="absolute left-0 top-0 h-full bg-acl rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="text-sm font-semibold text-tx">
                {option.label}
              </span>
              <span className="text-sm font-bold text-accent">
                {pct}%
              </span>
            </div>
          </button>
        )
      })}

      <p className="text-tx2 text-sm mt-1">
        {totalVotes.toLocaleString()} votes · {expiresAt}
      </p>
    </div>
  )
}