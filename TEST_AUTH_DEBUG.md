# 🔧 **Debug Authentication Issues**

## **Check 1: Verify Admin Login**
1. Open browser dev tools (F12)
2. Go to Application → Local Storage
3. Look for `token` key
4. Copy the token value

## **Check 2: Test Token Manually**
Open browser console and run:
```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);

// Test API call
fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Auth test result:', data))
.catch(err => console.error('Auth test error:', err));
```

## **Check 3: Test Bulk Upload API**
```javascript
// Test bulk upload endpoint
const token = localStorage.getItem('token');
fetch('/api/properties/bulk-upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    data: [{
      title: "Test Property",
      city: "Mumbai", 
      area: "Andheri East",
      categories: "coworking",
      image: "https://via.placeholder.com/400",
      locationDetails: "Test Address"
    }]
  })
})
.then(r => r.json())
.then(data => console.log('Bulk upload test:', data))
.catch(err => console.error('Bulk upload error:', err));
```

## **Expected Results:**
- ✅ Token should exist and be a long string
- ✅ Auth test should return user data
- ✅ Bulk upload test should show validation or success

## **If Still Failing:**
1. Check server console for detailed error logs
2. Verify JWT_SECRET is set in .env.local
3. Make sure you're using the same authentication method as other APIs
