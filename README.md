## about
subdomain-static is a nodejs module help you redirect subdomain request to certain file folders

it's required to be used with `express` & `serve-static`

## install
``` javascript
npm install subdomain-static 
```

## how to use
*	in `app.js`
``` javascript
app.use(require('subdomain-static')({ folder: 'apps' }));
... // lines of code
app.use(express.static(path.join(__dirname, 'public')));
```

*	create a folder you want to redirect to in `/public` 


## options pass to subdomain-static
*	folder(required)- folder redirect to
*	exclude_subdomains {Array}- any subdomain you want subdomain-static ignore
*	hostname {String}- hostname you want subdomain-static to support, if domain not equal to `hostname`, then the request will be ignored by subdomain-static
