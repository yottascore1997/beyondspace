# Bulk Upload - Possible Fields (Images Handled Separately)

## ✅ **SAB KUCH POSSIBLE HAI** (Images ke alawa)

Agar aap images baad mein manually add/edit karenge, to **almost sab kuch** Excel se bulk upload kar sakte hain!

---

## 📋 **Complete List of Possible Fields**

### ✅ **Basic Property Information** (100% Possible)
| Field | Excel Column | Type | Notes |
|-------|-------------|------|-------|
| **title** | A | Text | Property name (Required) |
| **city** | B | Text | Must exist in database (Required) |
| **area** | C | Text | Must exist in database (Required) |
| **sublocation** | D | Text | Optional |
| **purpose** | E | Text | RENT, BUY, or COMMERCIAL (Required) |
| **type** | F | Text | RESIDENTIAL, COMMERCIAL, COWORKING, MANAGED_OFFICE (Required) |
| **categories** | G | Text | Comma-separated: "coworking,managed,popular" (Required) |
| **priceDisplay** | H | Text | Display price: "₹11,999/month" (Required) |
| **price** | I | Number | Numeric price: 11999 (Required) |
| **size** | J | Number | Property size (Required) |
| **beds** | K | Text | Bedroom count: "2 BHK" (Required) |
| **rating** | L | Number | Rating: 4.5 (Required) |
| **tag** | M | Text | Property tag (Optional) |
| **description** | N | Text | Long description (Optional) |
| **propertyTier** | O | Text | Premium, Popular, Luxury, Ultra Luxury (Optional) |
| **displayOrder** | P | Number | Display order: 0, 1, 2... (Optional, default: 0) |

### ✅ **Location Details** (100% Possible)
| Field | Excel Column | Type | Notes |
|-------|-------------|------|-------|
| **locationDetails** | Q | Text | Full address (Optional) |
| **metroStationDistance** | R | Text | Primary metro: "2 km from Station A" (Optional) |
| **metroStationDistance2** | S | Text | Secondary metro: "3 km from Station B" (Optional) |
| **railwayStationDistance** | T | Text | Primary railway: "5 km from Station C" (Optional) |
| **railwayStationDistance2** | U | Text | Secondary railway: "6 km from Station D" (Optional) |
| **googleMapLink** | V | Text | Google Maps URL (max 191 chars) (Optional) |

### ✅ **Workspace Information** (100% Possible)
| Field | Excel Column | Type | Notes |
|-------|-------------|------|-------|
| **workspaceName** | W | Text | Workspace name (Optional) |
| **monFriTime** | X | Text | "9am-6pm" (Optional) |
| **saturdayTime** | Y | Text | "9am-1pm" (Optional) |
| **sundayTime** | Z | Text | "Closed" or "9am-5pm" (Optional) |
| **workspaceClosedDays** | AA | Text | Closed days info (Optional) |
| **aboutWorkspace** | AB | Text | About section content (Optional) |
| **capacity** | AC | Number | Seating capacity: 220 (Optional) |
| **superArea** | AD | Number | Super area in sq ft: 10000 (Optional) |

### ✅ **Seating Plans / Property Options** (Possible with JSON)
| Field | Excel Column | Format | Notes |
|-------|-------------|--------|-------|
| **propertyOptions** | AE | JSON String | Seating plans array (Optional) |

**Format Example:**
```json
[
  {"title":"Dedicated Desk","description":"Get your dedicated desk...","price":"11999","seating":"1-50"},
  {"title":"Flexi Desk","description":"Just show up...","price":"13000","seating":"1-50"},
  {"title":"Meeting Room","description":"Perfect for meetings...","price":"5000","seating":"04 Seater"},
  {"title":"Meeting Room","description":"Perfect for meetings...","price":"6000","seating":"06 Seater"}
]
```

**Simplified Format (Easier):**
```
Dedicated Desk|Get your dedicated desk...|11999|1-50
Flexi Desk|Just show up...|13000|1-50
Meeting Room|Perfect for meetings...|5000|04 Seater
Meeting Room|Perfect for meetings...|6000|06 Seater
```
(Use pipe `|` separator, newline for multiple plans)

### ✅ **Amenities** (Possible with JSON)
| Field | Excel Column | Format | Notes |
|-------|-------------|--------|-------|
| **amenities** | AF | JSON String | Amenities array (Optional) |

**Format Example:**
```json
[
  {"icon":"wifi","name":"High-Speed WiFi","category":"free"},
  {"icon":"parking","name":"Parking","category":"paid"},
  {"icon":"cafe","name":"Cafeteria","category":"premier"}
]
```

**Simplified Format:**
```
wifi|High-Speed WiFi|free
parking|Parking|paid
cafe|Cafeteria|premier
```

### ⚠️ **Images** (Handle Separately)
| Field | Status | Notes |
|-------|--------|-------|
| **image** (Primary) | ⚠️ Placeholder | Use empty string `""` or placeholder URL |
| **images** (Gallery) | ⚠️ Skip | Add later via Edit |

**Solution for Bulk Upload:**
- Use empty string `""` for `image` field initially
- Properties will be created without images
- Later, edit each property and add images manually
- OR use a placeholder image URL temporarily

---

## 📊 **Excel Template Structure**

### Column Mapping (Recommended Order)

| Column | Field Name | Required | Example |
|--------|------------|----------|---------|
| **A** | title | ✅ | "91Springboard - Lotus Star" |
| **B** | city | ✅ | "Mumbai" |
| **C** | area | ✅ | "Andheri East" |
| **D** | sublocation | ❌ | "MIDC" |
| **E** | purpose | ✅ | "COMMERCIAL" |
| **F** | type | ✅ | "COWORKING" |
| **G** | categories | ✅ | "coworking,managed,dedicateddesk" |
| **H** | priceDisplay | ✅ | "₹11,799/month" |
| **I** | price | ✅ | 11799 |
| **J** | size | ✅ | 1000 |
| **K** | beds | ✅ | "2 BHK" |
| **L** | rating | ✅ | 4.5 |
| **M** | tag | ❌ | "Premium" |
| **N** | description | ❌ | "Located in..." |
| **O** | propertyTier | ❌ | "Premium" |
| **P** | displayOrder | ❌ | 0 |
| **Q** | locationDetails | ❌ | "Plot No. D, 5th Rd..." |
| **R** | metroStationDistance | ❌ | "0.4 Km from MIDC Metro" |
| **S** | metroStationDistance2 | ❌ | "1.1 Km from Airport Road Metro" |
| **T** | railwayStationDistance | ❌ | "3.3 Km from Andheri Railway" |
| **U** | railwayStationDistance2 | ❌ | "9.2 Km from Ghatkopar Railway" |
| **V** | googleMapLink | ❌ | "https://maps.google.com/..." |
| **W** | workspaceName | ❌ | "Work Square - Sumer Plaza" |
| **X** | monFriTime | ❌ | "12:00 AM to 11:59 PM" |
| **Y** | saturdayTime | ❌ | "12:00 AM to 11:59 PM" |
| **Z** | sundayTime | ❌ | "Open" or "Closed" |
| **AA** | workspaceClosedDays | ❌ | "Closed (Sun)" |
| **AB** | aboutWorkspace | ❌ | "A) Provider offer..." |
| **AC** | capacity | ❌ | 220 |
| **AD** | superArea | ❌ | 10000 |
| **AE** | propertyOptions | ❌ | JSON or Simplified format |
| **AF** | amenities | ❌ | JSON or Simplified format |

---

## 🎯 **What's Possible: Summary**

### ✅ **100% Possible (Easy)**
- All basic property fields (title, city, area, price, etc.)
- Location details (address, metro, railway)
- Workspace information (timings, capacity, etc.)
- Categories (comma-separated)
- All text and number fields

### ✅ **Possible (With JSON Format)**
- Seating Plans (propertyOptions)
- Amenities
- Office Timing (if needed)

### ⚠️ **Handle Separately**
- Images (add later via Edit)

---

## 💡 **Recommended Workflow**

### Step 1: Bulk Upload (Excel)
1. Prepare Excel with all fields (except images)
2. Use empty string `""` for `image` field
3. Upload via bulk upload feature
4. All properties created successfully

### Step 2: Add Images (Manual)
1. Go to Admin > Properties
2. Edit each property
3. Upload images (up to 10 images)
4. Save

### Alternative: Two-Phase Upload
1. **Phase 1**: Upload properties without images
2. **Phase 2**: Batch update images (if we add this feature)

---

## 📝 **Example Excel Row**

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 91Springboard | Mumbai | Andheri East | MIDC | COMMERCIAL | COWORKING | coworking,managed | ₹11,799/month | 11799 | 1000 | 2 BHK | 4.5 |

**Property Options (Column AE):**
```
Dedicated Desk|Get your dedicated desk...|11999|1-50
Flexi Desk|Just show up...|13000|1-50
Meeting Room|Perfect for meetings...|5000|04 Seater
Meeting Room|Perfect for meetings...|6000|06 Seater
```

**Amenities (Column AF):**
```
wifi|High-Speed WiFi|free
parking|Parking|paid
cafe|Cafeteria|premier
```

---

## ✅ **Conclusion**

**Agar images baad mein manually add/edit karenge, to:**
- ✅ **95% fields possible** - Almost sab kuch Excel se upload kar sakte hain
- ✅ **Seating Plans possible** - JSON format mein
- ✅ **Amenities possible** - JSON format mein
- ⚠️ **Images separate** - Baad mein manually add karein

**Total Fields: ~30+ fields**
**Possible via Excel: ~28 fields**
**Handle Separately: 2 fields (image, images)**

**Recommendation:** ✅ **Bulk upload implement karein!** Images baad mein add kar lenge.

