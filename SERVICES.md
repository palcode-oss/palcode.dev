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
| A    | @ (palcode.dev) | <DigitalOcean server IPv4 or IPv6> | Auto | Yes     |
| A    | www             | <DigitalOcean server IPv4 or IPv6> | Auto | Yes     |

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
    
## Firebase
Firebase powers three core components of PalCode:
- User, classroom, and task data storage (Firestore)
- User authentication, security, and OAuth (Authentication)
- Audio feedback storage (Storage)

Here's how to set it up:

### Firestore
1. Use this instead of Realtime Database - they're not the same thing. Firestore is the new and improved version of Realtime Database.
2. When creating the database, select `europe-west2` as the server location. This is in [London](https://cloud.google.com/compute/docs/regions-zones). 
3. Set the default suggestion for security rules; we'll customise this in the next step.
4. In the 'Rules' tab, paste in the following security rules: https://gist.github.com/palkerecsenyi/90fec16d5f403ae30c63dea49e738020
5. Click 'Publish' to put the new rules into action.

### Authentication
1. Open the 'Sign-in Method' tab.
2. Ensure all methods are disabled.
3. Follow this guide to [create an Azure App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app). If setting up within your school's Azure directory, select Single Tenant mode. If setting up with a different Azure account, use Multitenant mode, with personal accounts **disabled**. This service is free of charge.
4. Enable Microsoft as an authentication method in Firebase, and add your Application Id and Application Secret.
5. In Azure, visit the 'Authentication' tab of your App Registration.
6. Click 'Add a platform', select 'Web', and paste the redirect URI provided by Firebase. This is **not** your PalCode domain.
7. Add the domain you're using to host PalCode to the 'Authorized domains' list
8. Keep the advanced settings as default.

### Storage
1. When creating the storage bucket, set `europe-west2` as the server location. 
2. After creating the bucket, open the 'Rules' tab, and paste the following security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /feedback/{taskId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

These rules are published here as they are unlikely ever to be changed.

### Retrieving keys
There are two different types of key you need to integrate Firebase with PalCode:

1. An app key for frontend, public use.
2. A service account key for backend, encrypted use.

#### Creating an app key
1. Click Settings > Project settings
2. In the 'General' tab, scroll to 'Your apps' and click 'Add app'.
3. Select 'Web', ensure Firebase Hosting is unticked, enter a nickname, and click 'Register app'
4. Click 'Continue to console', and store the JSON `firebaseConfig` away for later use. Setting these variables up for frontend builds is detailed in `README.md`.

#### Creating a service account key
1. Click Settings > Project settings
2. In the 'Service accounts' tab, click 'Generate new private key', and store this away for later use in `SETUP.md`
