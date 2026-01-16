# Firewall Security Guide

## 🔥 Firewall Kya Hai?

**Firewall** ek security barrier hai jo aapke application aur internet ke beech mein hota hai. Ye decide karta hai ki:
- Kaunse requests allow hone chahiye
- Kaunse requests block hone chahiye
- Kaunse IP addresses trusted hain
- Kaunse IP addresses suspicious hain

## 📋 Types of Firewalls

### 1. **Network-Level Firewall** (Infrastructure)
- Server/Cloud provider level par setup hota hai
- Examples: AWS WAF, Cloudflare Firewall, Azure Firewall
- **Kya karta hai**: Network traffic ko filter karta hai before application tak pahunchta hai

### 2. **Application-Level Firewall** (Code Level)
- Application code mein implement hota hai
- **Kya karta hai**: Application ke andar requests ko check karta hai
- **Humne implement kiya hai**: `src/lib/firewall.ts`

## ✅ Humne Kya Implement Kiya Hai

### Application-Level Firewall Features:

1. **IP Whitelisting** ✅
   - Specific IPs ko always allow karta hai
   - Admin panel ke liye useful

2. **IP Blacklisting** ✅
   - Specific IPs ko always block karta hai
   - Malicious IPs ko ban karne ke liye

3. **Automatic Suspicious Activity Detection** ✅
   - Agar koi IP bahut zyada requests bhej raha hai, automatically block ho jata hai
   - Configurable threshold (default: 100 requests/minute)

4. **CIDR Notation Support** ✅
   - IP ranges ko support karta hai (e.g., `192.168.1.0/24`)
   - Multiple IPs ko ek saath allow/block kar sakte hain

5. **Wildcard Support** ✅
   - Pattern matching (e.g., `192.168.*`)

6. **Temporary Blocking** ✅
   - IPs ko specific time ke liye block kar sakte hain
   - Auto-expire ho jata hai

## 🚀 Kaise Use Karein

### Environment Variables Setup

`.env` file mein add karein:

```env
# Enable/Disable Firewall
FIREWALL_ENABLED=true

# Whitelist IPs (comma-separated)
# Admin panel ke liye apne office IPs add karein
FIREWALL_WHITELIST="192.168.1.100,203.0.113.0/24"

# Blacklist IPs (comma-separated)
# Known malicious IPs
FIREWALL_BLACKLIST="1.2.3.4,5.6.7.8"

# Maximum requests per minute (auto-block threshold)
FIREWALL_MAX_REQUESTS_PER_MINUTE=100
```

### IP Address Formats Supported:

1. **Single IP**: `192.168.1.100`
2. **CIDR Range**: `192.168.1.0/24` (entire subnet)
3. **Wildcard**: `192.168.*` (all IPs starting with 192.168)

### Examples:

```env
# Office IPs (whitelist)
FIREWALL_WHITELIST="203.0.113.50,203.0.113.51,203.0.113.52"

# Office Network (CIDR)
FIREWALL_WHITELIST="203.0.113.0/24"

# Block specific malicious IPs
FIREWALL_BLACKLIST="1.2.3.4,5.6.7.8"
```

## 🛡️ Current Protection

Abhi aapke application mein firewall automatically protect kar raha hai:

1. **API Routes** (`/api/*`) - Sabhi API endpoints protected
2. **Admin Routes** (`/admin/*`) - Admin panel protected

## 📊 How It Works

```
Request → Get IP Address → Check Whitelist → Check Blacklist → 
Check Rules → Check Suspicious Activity → Allow/Block
```

### Flow:

1. **Request aata hai** → IP address extract hota hai
2. **Whitelist check** → Agar whitelist mein hai, allow
3. **Blacklist check** → Agar blacklist mein hai, block
4. **Rules check** → Custom rules check hote hain
5. **Suspicious activity** → Agar bahut zyada requests, auto-block
6. **Default action** → Allow ya block (configurable)

## 🔧 Advanced Usage (Code Mein)

### Programmatically Block IP:

```typescript
import { addBlockRule } from '@/lib/firewall';

// Block IP for 1 hour
addBlockRule('1.2.3.4', 'Suspicious activity detected', 60 * 60 * 1000);
```

### Programmatically Allow IP:

```typescript
import { addAllowRule } from '@/lib/firewall';

// Allow IP temporarily
addAllowRule('192.168.1.100', 'Temporary access', 24 * 60 * 60 * 1000);
```

### Check IP Status:

```typescript
import { getFirewallStatus } from '@/lib/firewall';

const status = getFirewallStatus('192.168.1.100');
console.log(status);
// {
//   allowed: true,
//   isWhitelisted: false,
//   isBlacklisted: false,
//   requestCount: 5
// }
```

## 🌐 Infrastructure-Level Firewall (Recommended)

Application-level firewall ke saath, infrastructure-level firewall bhi use karein:

### Options:

1. **Cloudflare** (Recommended)
   - Free tier available
   - DDoS protection
   - WAF (Web Application Firewall)
   - Rate limiting
   - IP blocking

2. **AWS WAF**
   - AWS services ke saath integrate
   - Advanced rules
   - Cost-based

3. **Vercel Edge Functions**
   - Vercel deploy kiya hai to built-in protection
   - Edge-level blocking

4. **Nginx/Apache Firewall**
   - Server-level protection
   - mod_security module

## ⚠️ Important Notes

1. **Development**: Firewall ko disable kar sakte hain
   ```env
   FIREWALL_ENABLED=false
   ```

2. **Production**: Always enable karein
   ```env
   FIREWALL_ENABLED=true
   ```

3. **IP Detection**: Load balancers/proxies ke saath properly kaam karta hai
   - `X-Forwarded-For` header check karta hai
   - `X-Real-IP` header check karta hai

4. **Memory Storage**: Abhi in-memory storage use ho raha hai
   - Production mein Redis ya database use karein
   - Multiple servers ke liye shared storage chahiye

5. **Rate Limiting**: Firewall ke saath rate limiting bhi already implement hai
   - Double protection layer

## 🎯 Best Practices

1. **Admin Panel**: Always whitelist karein apne office IPs
2. **Monitoring**: Suspicious IPs ko regularly check karein
3. **Logging**: Blocked requests ko log karein
4. **Updates**: Blacklist ko regularly update karein
5. **Testing**: Development mein test karein before production

## 📝 Summary

✅ **Application-Level Firewall** - Implemented
✅ **IP Whitelisting** - Available
✅ **IP Blacklisting** - Available
✅ **Auto-Blocking** - Suspicious activity detection
✅ **CIDR Support** - IP ranges support
✅ **Middleware Integration** - API & Admin routes protected

🔜 **Recommended Next Steps**:
- Infrastructure-level firewall setup (Cloudflare recommended)
- Redis-based storage for production
- Logging and monitoring system
- Admin dashboard for firewall management

