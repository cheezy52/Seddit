json.(sub, :id, :name, :owner_id, :created_at)
json.posts sub.posts, partial: "api/posts/post", as: :post