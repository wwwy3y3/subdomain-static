## about
subdomain-static is a nodejs module help you redirect subdomain request to certain file folders

it's required to be used with express

## install
``` javascript
npm install subdomain-static 
```

## how to use
*	in `app.js`
``` javascript
app.use(require('subdomain-static')('<folder_path>'));
... // lines of code
app.use(express.static(path.join(__dirname, 'public')));
```

*	create a folder you want to redirect to in `/public` 
