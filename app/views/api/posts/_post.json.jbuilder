json.(post, :id, :link, :title, :owner_id, :sub_id, :created_at, :updated_at)
json.karma(post.karma)
json.upvotes(post.upvotes)
json.downvotes(post.downvotes)
json.num_comments(post.num_comments)
json.class_name("Post")
json.already_voted(post.user_already_voted?(current_user))
if post.user_already_voted?(current_user)
  json.upvoted(post.user_upvoted?(current_user))
  json.vote_id(post.user_vote_id(current_user))
end
json.owner_name(post.owner.username)