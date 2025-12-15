# DNS Setup Guide for goolle.shop with GitHub Pages

## Current Status
✅ GitHub Pages is enabled
✅ Repository is public
✅ CNAME file created (goolle.shop)
⚠️ **DNS records need to be configured at your domain registrar**

## What You Need To Do

You need to update the DNS records at your domain registrar (where you purchased goolle.shop) to point to GitHub Pages servers.

---

## Step-by-Step DNS Configuration

### Step 1: Find Your Domain Registrar

Your domain registrar is where you purchased goolle.shop. Common registrars include:
- Namecheap
- GoDaddy
- Cloudflare
- Google Domains (now Squarespace)
- Hostinger
- Name.com

To find your registrar, visit: https://lookup.icann.org/ and search for "goolle.shop"

### Step 2: Log Into Your Domain Registrar

1. Go to your domain registrar's website
2. Log in to your account
3. Find "DNS Management" or "DNS Settings" or "Advanced DNS"

### Step 3: Delete Existing Records

**Important:** Remove any existing A records or CNAME records for:
- @ (apex/root domain)
- www subdomain

This ensures no conflicts with the new GitHub Pages configuration.

### Step 4: Add GitHub Pages A Records

Add these **4 A records** (one for each IP address):

```
Type: A
Name: @ (or leave blank, or "apex", or "root")
Value: 185.199.108.153
TTL: 3600 (or Auto)
```

```
Type: A
Name: @
Value: 185.199.109.153
TTL: 3600
```

```
Type: A
Name: @
Value: 185.199.110.153
TTL: 3600
```

```
Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

### Step 5: Add CNAME Record for www

Add this **CNAME record**:

```
Type: CNAME
Name: www
Value: geeddiga.github.io
TTL: 3600 (or Auto)
```

**Note:** Some registrars automatically add a period (.) at the end of the value. If your registrar requires it, use `geeddiga.github.io.` (with the trailing dot).

---

## Visual Example of Final DNS Configuration

Your DNS records should look like this:

| Type  | Name/Host | Value/Points To        | TTL  |
|-------|-----------|------------------------|------|
| A     | @         | 185.199.108.153        | 3600 |
| A     | @         | 185.199.109.153        | 3600 |
| A     | @         | 185.199.110.153        | 3600 |
| A     | @         | 185.199.111.153        | 3600 |
| CNAME | www       | geeddiga.github.io     | 3600 |

---

## After DNS Configuration

### Wait for DNS Propagation
- DNS changes can take anywhere from **5 minutes to 48 hours** to propagate globally
- Typically it takes **1-4 hours**
- You can check propagation status at: https://www.whatsmydns.net/

### Verify Configuration in GitHub

1. Go to: https://github.com/GEEDDIGA/vite-react/settings/pages
2. Wait for the DNS error message to disappear
3. Click the **"Check again"** button if the error persists after a few hours
4. Once DNS is verified, you'll see: ✅ **DNS check successful**

### Enable HTTPS (After DNS Verification)

1. In GitHub Pages settings, check the box: **"Enforce HTTPS"**
2. Wait a few minutes for the SSL certificate to be provisioned
3. Your site will be available at: **https://goolle.shop**

---

## Troubleshooting

### DNS Check Still Failing?

1. **Wait longer**: DNS propagation can take up to 48 hours
2. **Clear your browser cache**: Or use an incognito window
3. **Check your DNS records**: Use https://dnschecker.org/ to verify they're correct
4. **Verify all 4 A records**: Make sure all 4 IP addresses are added
5. **Check CNAME record**: Ensure it points to `geeddiga.github.io` (not `geeddiga.github.io/vite-react`)

### Common Registrar-Specific Instructions

#### Namecheap
1. Log in → Domain List → Manage
2. Advanced DNS tab
3. Add A Records with Host: @
4. Add CNAME with Host: www

#### GoDaddy
1. Log in → My Products → DNS
2. Click "Add" for each record
3. Use @ for root domain records

#### Cloudflare
1. Log in → Select domain → DNS
2. Add A and CNAME records
3. **Important**: Set proxy status to "DNS only" (gray cloud) for initial setup

#### Google Domains (Squarespace)
1. Now managed by Squarespace Domains
2. Log in at: https://domains.squarespace.com/
3. Follow similar steps for DNS management

---

## Testing Your Configuration

### Using Command Line

**Check A Records:**
```bash
dig goolle.shop +short
```
Should return the 4 GitHub Pages IP addresses.

**Check CNAME Record:**
```bash
dig www.goolle.shop +short
```
Should return `geeddiga.github.io` and then the IP addresses.

### Using Online Tools

1. **DNSChecker**: https://dnschecker.org/
   - Enter: goolle.shop
   - Check if A records show GitHub IPs globally

2. **WhatsMyDNS**: https://www.whatsmydns.net/
   - Enter: goolle.shop
   - Type: A
   - See propagation status worldwide

---

## What Happens After DNS is Fixed?

1. ✅ Your site at **goolle.shop** will load from GitHub Pages
2. ✅ Free SSL certificate will be automatically provisioned
3. ✅ HTTPS will be available (enable "Enforce HTTPS" in settings)
4. ✅ Both **goolle.shop** and **www.goolle.shop** will work
5. ✅ GitHub Pages will automatically redirect HTTP to HTTPS
6. ✅ Your site will have 99.9% uptime with GitHub's infrastructure

---

## Important Notes

- **No costs**: GitHub Pages hosting is completely free for public repositories
- **Automatic deployments**: Every commit to main branch automatically updates your live site
- **Custom domain**: Your domain (goolle.shop) works with free GitHub Pages
- **SSL/HTTPS**: Free SSL certificate included automatically
- **Global CDN**: GitHub serves your site from multiple locations worldwide

---

## Need Help?

If you're stuck:

1. **Check GitHub's official docs**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
2. **GitHub Community**: https://github.community/
3. **Your registrar's support**: Contact them for help adding DNS records

---

## Current URLs

- **GitHub Pages default**: https://geeddiga.github.io/vite-react/
- **Custom domain (current)**: https://goolle.shop (currently pointing to old hosting)
- **Custom domain (after DNS)**: https://goolle.shop (will point to GitHub Pages)

---

**Last Updated**: December 15, 2025
