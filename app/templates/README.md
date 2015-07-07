# <%= opts.slugifiedName %>

> <%= opts.description %>

<% if (opts.useHeroku) { %>
## Server access  
[https://<%= opts.herokuAppName %>.herokuapp.com](https://<%= opts.herokuAppName %>.herokuapp.com)  
**Credentials**  
<%= opts.restrictedAccess.username %> / <%= opts.restrictedAccess.passwordClear %>
<% } %>

## [CHANGELOG](./CHANGELOG.md)

## INSTALL

```shell
$ npm install
```

## Dev tasks

Start watching & server  
```shell
$ npm run dev
```

Build the app  
```shell
$ npm run build
```

Push to staging  
```shell
$ npm run staging
```
