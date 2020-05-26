## Open ID Connect 1.0

- ID Token: MUST be .

### IDToken

- 署名 → 暗号化（暗号化は省略可能）
- Standard Claims
  - iss: OpenID Provider ID
  - sub: 認証されたユーザの識別子
  - auth_time: 認証された時間
  - ほか
    - sub, name, given_name, family_name, middle_name, nickname, profile, picture, website
    - email, email_verified, ...
  - 言語タグをつけて多言語化することも可能
- 特殊なクレーム
  - at_hash: ID トークンと同時に発行されるアクセストークンのハッシュ値
  - c_hash: ID トークンと同時に発行される認可コードのハッシュ値

## JWT

### Token types

- JWT
  - JWE
  - JWS

### Claims

- iss: JWT の発行者の識別子
- sub: クレームが述べる対象となる者の識別子
- aud: JWT 利用者の識別子一覧
- nbf - exp: nbf 〜 exp まで有効

## OAuth 2.0

### フローの種類

- A. 認可エンドポイント
- B. トークンエンドポイント

* Grant Code Flow: A & B
* Implicit Flow: A **非推奨**
* Resource Owner Password Credentials Flow: B
* Client Credentials Flow: B
* Refresh Token Flow: B
