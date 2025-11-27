# Actual Form Fields - Excel Mapping

## ✅ **Visible Form Fields Only** (Based on PropertyForm.tsx)

### **Basic Property Information**
| Excel Column | Form Field Name | Label | Required | Type | Notes |
|-------------|-----------------|-------|----------|------|-------|
| A | `title` | Property Title | ✅ Yes | Text | Main property name |
| B | `city` | City | ✅ Yes | Select | Must exist in database |
| C | `area` | Area | ✅ Yes | Select | Must exist for the city |
| D | `sublocation` | Sub Location | ❌ No | Text | Optional sub-location |
| E | `propertyTier` | Type of Property | ❌ No | Select | Popular, Premium, Luxury, Ultra Luxury |
| F | `categories` | Categories | ✅ Yes | Multi-select | Comma-separated: coworking,managed,etc |

### **Property Image** 
| Excel Column | Form Field Name | Label | Required | Type | Notes |
|-------------|-----------------|-------|----------|------|-------|
| G | `image` | Property Image | ✅ Yes (new) | URL/File | Main property image URL |

### **Property Details Section**
| Excel Column | Form Field Name | Label | Required | Type | Notes |
|-------------|-----------------|-------|----------|------|-------|
| H | `locationDetails` | Address Details | ✅ Yes | Textarea | Full address |
| I | `metroStationDistance` | Nearest Metro Station Distance | ❌ No | Text | Primary metro distance |
| J | `metroStationDistance2` | Secondary Metro Station | ❌ No | Text | Optional second metro |
| K | `railwayStationDistance` | Nearest Railway Station Distance | ❌ No | Text | Primary railway distance |
| L | `railwayStationDistance2` | Secondary Railway Station | ❌ No | Text | Optional second railway |
| M | `googleMapLink` | Google Map Link | ❌ No | URL | Google Maps URL |
| N | `aboutWorkspace` | About Space | ❌ No | Textarea | Description of the space |

### **Workspace Details** (Only for COWORKING/MANAGED_OFFICE)
| Excel Column | Form Field Name | Label | Required | Type | Notes |
|-------------|-----------------|-------|----------|------|-------|
| O | `monFriTime` | Monday to Friday Timing | ✅ Yes* | Text | *Required if coworking/managed |
| P | `saturdayTime` | Saturday Timing | ❌ No | Text | Saturday hours |
| Q | `sundayTime` | Sunday Timing | ❌ No | Text | Sunday hours |

### **Amenities** (Only for COWORKING/MANAGED_OFFICE)
| Excel Column | Form Field Name | Label | Required | Type | Notes |
|-------------|-----------------|-------|----------|------|-------|
| R | `amenities` | Select Amenities | ❌ No | Multi-select | JSON array of selected amenities (defaults to ALL selected if empty) |

### **Seating Plans** 
| Excel Column | Form Field Name | Label | Required | Type | Notes |
|-------------|-----------------|-------|----------|------|-------|
| S | `seatingPlans` | Seating Plans | ❌ No | Complex | JSON array of seating plan objects |

---

## 🚫 **Fields NOT in Form** (Skip in Excel)

These fields exist in database but are NOT visible in the current form:
- `purpose` - Auto-generated from categories
- `type` - Auto-generated from categories  
- `displayOrder` - Not in form
- `priceDisplay` - Not in form
- `price` - Not in form
- `size` - Not in form
- `beds` - Not in form
- `rating` - Not in form
- `tag` - Not in form
- `description` - Not in form
- `workspaceName` - Removed from form
- `workspaceTimings` - Auto-generated from mon/sat/sun times
- `workspaceClosedDays` - Not in form
- `capacity` - Removed from form
- `superArea` - Removed from form

---

## 📋 **Excel Template Structure**

### Header Row:
```
title,city,area,sublocation,propertyTier,categories,image,locationDetails,metroStationDistance,metroStationDistance2,railwayStationDistance,railwayStationDistance2,googleMapLink,aboutWorkspace,monFriTime,saturdayTime,sundayTime,amenities,seatingPlans
```

### Example Data Row:
```
"91Springboard - Lotus Star","Mumbai","Andheri East","MIDC","Premium","coworking,managed,dedicateddesk","https://example.com/image.jpg","Plot No. D, 5th Road, MIDC, Andheri East, Mumbai","0.4 Km Walking Distance From MIDC Metro Station","1.1 Km Walking Distance From Airport Road Metro Station","3.3 Km Drive From Andheri Railway Station","9.2 Km Drive From Ghatkopar Railway Station","https://maps.google.com/xyz","Premium coworking space with modern amenities","9:00 AM - 6:00 PM","9:00 AM - 1:00 PM","Closed","[{""icon"":""wifi"",""name"":""High-Speed WiFi"",""category"":""free""}]","[{""id"":""dedicated-desk"",""title"":""Dedicated Desk"",""description"":""Get your dedicated desk..."",""price"":""11999"",""seating"":""1-50"",""isSelected"":true}]"
```

---

## 🔧 **Auto-Generated Fields Logic**

### 1. `purpose` (Auto-generated)
```javascript
// Based on first category
if (categories.includes('coworking') || categories.includes('managed') || categories.includes('dedicateddesk')) {
  purpose = 'COMMERCIAL'
} else {
  purpose = 'COMMERCIAL' // Default
}
```

### 2. `type` (Auto-generated) 
```javascript
// Based on first category
if (categories.includes('coworking')) {
  type = 'COWORKING'
} else if (categories.includes('managed')) {
  type = 'MANAGED_OFFICE'  
} else {
  type = 'COWORKING' // Default
}
```

### 3. `workspaceTimings` (Auto-generated)
```javascript
// Combine mon/sat/sun times
workspaceTimings = `Mon-Fri: ${monFriTime} | Sat: ${saturdayTime} | Sun: ${sundayTime}`
```

### 4. Default Values
```javascript
displayOrder = 0
priceDisplay = ""
price = 0
size = 0
beds = ""
rating = 0
tag = ""
description = ""
workspaceClosedDays = ""
capacity = 0
superArea = 0
```

---

## 📊 **Total Fields Count**

- **Visible in Form**: 19 fields
- **Excel Columns**: 19 columns
- **Auto-generated**: 6 fields
- **Default values**: 10 fields
- **Total Database Fields**: 35+ fields

---

## ✅ **Implementation Strategy**

1. **Excel Template**: 19 columns matching visible form fields
2. **Upload API**: Parse Excel → Map to form fields → Auto-generate missing fields
3. **Validation**: Same validation as form (required fields, city/area existence)
4. **Images**: Handle separately (URL in Excel, files uploaded later)
5. **Complex Fields**: JSON format for amenities and seating plans

---

## 🎯 **Benefits**

- ✅ **Exact Match**: Excel fields = Form fields
- ✅ **No Confusion**: Only what user sees in form
- ✅ **Validation**: Same rules as manual form entry
- ✅ **Maintainable**: If form changes, Excel template changes
- ✅ **User-Friendly**: Users know exactly what each field does
