# spa_blog-project

- 댓글 목록 조회:
  URL: /comments
  예시 요청: GET /comments

- 댓글 작성:
  URL: /comments
  요청 바디(body): \_postId, user, password, content 필드 포함
  예시 요청: POST /comments
  (ex)
  {
  "\_postId": "댓글이 달릴 게시글의 ID",
  "user": "댓글 작성자",
  "password": "댓글 작성자의 비밀번호",
  "content": "댓글 내용"
  }

- 댓글 수정:
  URL: /comments/:id
  :id에 수정할 댓글의 ID를 지정
  요청 바디(body): postId, password, content 필드 포함
  예시 요청: PUT /comments/댓글의 ID
  (ex)
  {
  "\_id": "6493d88fc1c95ad14b4a1c23" // \_postId 입력,
  "password": "123456",
  "content": "수정된 test 댓글입니다."
  }

- 댓글 삭제:
  URL: /comments/:id
  :id에 삭제할 댓글의 ID를 지정
  요청 바디(body): postId, password 필드 포함
  예시 요청: DELETE /comments/댓글의 ID

- 게시글 목록 조회:
  URL: /posts
  예시 요청: GET /posts

- 게시글 작성:
  URL: /posts
  요청 바디(body): user, password, title, content 필드 포함
  예시 요청: POST /posts
  (ex)
  {
  "user": "게시글 작성자",
  "password": "게시글 작성자의 비밀번호",
  "title": "게시글 제목",
  "content": "게시글 내용"
  }

- 특정 게시글 조회:
  URL: /posts/:id
  :id에 조회할 게시글의 ID를 지정
  예시 요청: GET /posts/게시글의 ID

- 게시글 수정:
  URL: /posts/:id
  :id에 수정할 게시글의 ID를 지정
  요청 바디(body): password, title, content 필드 포함
  예시 요청: PUT /posts/게시글의 ID

- 게시글 삭제:
  URL: /posts/:id
  :id에 삭제할 게시글의 ID를 지정
  요청 바디(body): password 필드 포함
  예시 요청: DELETE /posts/게시글의 ID
