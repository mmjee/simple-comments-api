### Simple Comments API

A Simple API to add comments anywhere.

##### Deployment instructions

```shell
# Change the domain and email
$EDITOR auto.Dockerfile

# Can also be done via docker-compose
docker build -t simplecomments:latest -f auto.Dockerfile .
```

Now, when creating a container via the CLI or compose or whatever, don't forget to create these **environment variables**:

- `LE_MAINTAINER_EMAIL`: Your email.
- `HTTP_PORT`: By default 443, but you're likely to have this conflict with other services, so change it to something like 8000 + something unique to your deployment

Now the service is available at `https://<your domain>:<HTTP_PORT>` over both IPv4 and IPv6 and Let's Encrypt will handle HTTPS automatically.

### License

Licensed under AGPLv3, see [LICENSE.md](LICENSE.md) or [LICENSE](LICENSE).
