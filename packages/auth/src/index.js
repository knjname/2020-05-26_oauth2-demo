const Koa = require("koa");
const querystring = require("querystring");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const router = new Router();
const cors = require("@koa/cors");

let grantCodeDictionary = {};

/**
 * クライアントから認証のために呼び出される画面
 */
router.get("/auth_endpoint", async (ctx, next) => {
  const {
    response_type,
    client_id,
    redirect_uri,
    scope,
    state,
    code_challenge,
    code_challege_method,
  } = ctx.request.query;

  ctx.body = `<h1>${client_id}のために認証しようとしています</h1>
    <form method=post action=/auth_endpoint>
        <input name=login_id placeholder=LoginId>
        <input type=password placeholder=Password name=password>
        <input type=submit>
        <hr />
        <input name="response_type" value=${response_type}>
        <input name="redirect_uri" value=${redirect_uri}>
        <input name="scope" value=${scope}>
        <input name="state" value=${state}>
    </form>`;
  next();
});

router.post("/auth_endpoint", async (ctx, next) => {
  const {
    login_id,
    redirect_uri,
    password,
    response_type,
    scope,
    state,
  } = ctx.request.body;

  if (response_type === "code") {
    // 認可コードフロー
    const code = `GrantCode-${Math.random()}`;
    grantCodeDictionary[code] = true;

    ctx.code = 302; // 302 Found
    ctx.redirect(
      `${redirect_uri}?${querystring.stringify({
        code,
        state: "",
      })}`
    );
    next();
    return;
  }

  if (response_type === "token") {
    // インプリシットフロー

    ctx.redirect(
      `${redirect_uri}#${querystring.stringify({
        access_token: "UNKO",
        token_type: "",
        expires_in: "",
        scope,
        state,
      })}`
    );
  }

  next();
});

/**
 * 認可コードを受け取るエンドポイント
 */
router.post("/token_endpoint", async (ctx, next) => {
  const { grant_type } = ctx.request.body;

  console.log(`token_endpoint: ${JSON.stringify(ctx.request.body)}`);

  if (grant_type === "password") {
    console.log("token_endpoint: Resource Owner Password Credentials Flow");
    const { code, client_id, user_name, password } = ctx.request.body;

    next();
    return;
  }

  if (grant_type === "client_credentials") {
    console.log("token_endpoint: Client Credentials Flow");
    const { client_id, client_secret, audience } = ctx.request.body;
    ctx.body = {
      access_token: "access_token",
      token_type: "token_type",
      expires_in: "expiration in sec",
      refresh_token: "refresh_token",
      scope: "scope",
    };
    next();
    return;
  }

  if (grant_type === "refresh")
    ctx.body = {
      access_token: "access_token",
      token_type: "token_type",
      expires_in: "expiration in sec",
      refresh_token: "refresh_token",
      scope: "scope",
    };
  next();
});

/**
 * アクセストークン情報の問い合わせエンドポイント
 */
router.post("/introspection_endpoint", async (ctx, next) => {});

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
