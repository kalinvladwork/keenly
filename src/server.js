const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const ejs = require('ejs');
const R = require('ramda');

const getTemplatePath = R.compose(
    R.curryN(2, path.resolve)(__dirname),
    R.concat('.', R.__),
    R.path(['request', 'url'])
);

const app = new Koa();

app.use(serve('.'));

app.use(async (ctx) => {
    try {
        const template = getTemplatePath(ctx);
        if(template.includes('.html')) {
            const body = await ejs.renderFile(template);
            const links = body.match(/<link[^>]+>/gi);
            
            if(links) {
                ctx.body = R.pipe(
                    R.replace(/<link[^>]+>/gi, ''),
                    R.replace('</head>', R.concat(R.join('', links), '</head>'))
                )(body);
            }
            else {
                ctx.body = body;
            }
        }
    }
    catch(e) {
        console.error(e);
        ctx.body = 'TEMPLATE_NOT_FOUND';
    }
});

app.listen(3001);

console.log('Listening on port 3001')