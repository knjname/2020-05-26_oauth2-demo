require("isomorphic-fetch");

const Koa = require("koa");
const querystring = require("querystring");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const router = new Router();

const client_id = "TheClient";

router.get("/", async (ctx, next) => {
  ctx.body = `
  <section>
    <h1>認可コードフローの方はこちらへどうぞ</h1>
    <a href="http://localhost:3000/auth_endpoint?${querystring.stringify({
      // "code" = 認可コードフローの呼び出し
      response_type: "code",
      client_id,
      redirect_uri: "http://localhost:3100/callback/code",
      scope: "",
      state: "",
      code_challenge: "",
      code_challege_method: "",
    })}">LOGIN</a>
  </section>  

  <hr />
  
  <section>
    <h1>インプリシットフローの方はこちらへどうぞ</h1>
    <a href="http://localhost:3000/auth_endpoint?${querystring.stringify({
      // "code" = 認可コードフローの呼び出し
      response_type: "token",
      client_id,
      redirect_uri: "http://localhost:3100/callback/token",
      scope: "",
      state: "",
      code_challenge: "",
      code_challege_method: "",
    })}">LOGIN</a>
  </section>  

    <hr />

    <section>
      <h1>クライアントクレデンシャルズフローの方はこちらでどうぞ</h1>
      <button id="do_client_credentials">実行</button>
      <pre id="do_client_credentials_result">

      </pre>
  
      <script>
        document.getElementById("do_client_credentials").onclick = async () => {
          const result = await fetch("http://localhost:3000/token_endpoint", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials&client_id=${client_id}&client_secret=SecretPassword"
          })
          const tokens = await result.json()
          document.getElementById("do_client_credentials_result").innerText = JSON.stringify(tokens)
        }
      </script>
    </section>

  `;
  next();
});

router.get("/callback/code", async (ctx, next) => {
  const { code, state } = ctx.request.query;

  await fetch(`http://localhost:3000/token_endpoint`, {
    method: "POST",
    body: querystring.encode({
      grant_type: "authorization_code",
      code,
      client_id: "client",
      redirect_uri: "",
    }),
  });

  next();
});

router.get("/callback/token", async (ctx, next) => {
  const { code, state } = ctx.request.query;

  ctx.type = "text/html";
  ctx.body = `
  アクセストークンなどは、
  <script>
    const tokens = location.hash.replace(/^#/, "").split("&").reduce((l, r) => { const [k, v] = r.split("="); l[decodeURIComponent(k)] = decodeURIComponent(v); return l }, {});
    document.write(JSON.stringify(tokens));
  </script>
  です！
  `;

  next();
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3100);
