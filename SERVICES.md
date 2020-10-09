This document details how to set up the various services PalCode depends on.

## DigitalOcean
PalCode will run on any server, but we'll use DigitalOcean for this explanation.

1. Visit https://digitalocean.com and sign in.
2. Click Create > Droplet.
3. Select Ubuntu (20.04 LTS).
4. Select the plan you want
    - The $5/mo Shared CPU plan is probably sufficient, but a $10/mo or $15/mo plan is recommended. This can be scaled at any time, without commitment.
5. Select London 1 as the datacentre region.
6. Optionally enable IPv6 networking. This isn't necessary, but may be in the future.
7. Create an SSH key, or a password to authenticate. Either option will work just as effectively, but a password is ultimately more portable, making it easier for maintainers to access the server. Of course, make sure to choose something long and secure.
8. Optionally enable backups, at 20% of the Droplet price. This can be helpful in regaining user code data should the Droplet crash irrecoverably. Other than code files created by users, no other data is stored on the server – Firebase is used for database management, which is hosted externally.
9. Access the server using SSH. Make sure to run `apt update` before installing any packages.

### Other server providers
If for any reason you choose not to use DigitalOcean, here are some other trustworthy hosting providers (all have servers in London):

- [Linode](https://www.linode.com/) - used by https://codedragon.org, price-matches DigitalOcean on all plans
- [GCP Compute](https://cloud.google.com/compute)
- [AWS EC2](https://aws.amazon.com/ec2/)
- [Vultr](https://www.vultr.com/products/cloud-compute/)

## Cloudflare
Setting up Cloudflare with Namecheap is a relatively straight-forward process, and can be done entirely without a console. Follow [this guide](https://www.namecheap.com/support/knowledgebase/article.aspx/9607/2210/how-to-set-up-dns-records-for-your-domain-in-cloudflare-account).

### Recommended Cloudflare settings

These settings ensure the maximum available security and integrity of PalCode, and have all been tested to work within MGS's network.

#### DNS
| Type | Name            | Content                            | TTL  | Proxied |
|------|-----------------|------------------------------------|------|---------|
| A    | @ (palcode.dev) | DigitalOcean server IPv4 or IPv6 | Auto | Yes     |
| A    | www             | DigitalOcean server IPv4 or IPv6 | Auto | Yes     |

- DNSSEC: Enabled (requires adding a DS record to Namecheap)
    - Important for ensuring DNS requests cannot be forged

#### SSL/TLS
- Encryption mode: Full (strict)
- Edge Certificates > Always Use HTTPS: Enabled
- Edge Certificates > HSTS: Enabled
    - Max-Age: 6 months
    - Include subdomains: Enabled
    - Preload: Enabled
    - palcode.dev uses the `.dev` gTLD, which is [universally added](https://ma.ttias.be/chrome-force-dev-domains-https-via-preloaded-hsts/) to the Google Chrome HSTS preload list. All websites using .dev can only be loaded via a verified TLS certificate in Chrome, Firefox, and their derivatives. However, enabling HSTS via Cloudflare enforces this on other browsers, too.
- Edge Certificates > Minimum TLS Version: Leave default (1.0)
- Edge Certificates > TLS 1.3: Enabled
- Edge Certificates > Automatic HTTPS Rewrites: Enabled

#### Speed > Optimization
- Auto Minify: All
- Brotli: Enabled
    - [Brotli](https://en.wikipedia.org/wiki/Brotli) is a relatively new, highly efficient, lossless text and font compression algorithm. It helps decrease load times and bandwidth significantly.
- Rocket Loader: **Disabled**
    - Rocket Loader works as a sort of replacement for frontend routing. React does this already, so Rocket Loader can create very buggy behaviour, and in this case probably worsens performance and load bandwidth.
    
#### Caching > Configuration
- Caching Level: Standard
- Browser Cache TTL: 1 month
    - All frontend assets have MD5 hash strings in their file names, so a relatively long caching policy can be used, as any changes to files will reliably cause the cache to be 'reset'.
