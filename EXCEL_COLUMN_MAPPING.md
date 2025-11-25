# Excel Column to Database Field Mapping

## Complete Column Mapping

| Excel Column Name | Database Field | Description | Required | Notes |
|-------------------|----------------|-------------|----------|-------|
| `title` | `title` | Property title/name | ✅ Yes | Main property name |
| `city` | `city` | City name | ✅ Yes | Must exist in database |
| `area` | `area` | Area/location name | ✅ Yes | Must exist in database for the city |
| `sublocation` | `sublocation` | Sub-location (optional) | ❌ No | Additional location detail |
| `type` | `type` | Property type | ❌ No | Auto-generated from categories if not provided. Values: RESIDENTIAL, COMMERCIAL, COWORKING, MANAGED_OFFICE |
| `categories` | `categories` | Property categories (comma-separated) | ✅ Yes | Example: "coworking,managed,dedicateddesk" |
| `priceDisplay` | `priceDisplay` | Display price string | ❌ No | Example: "₹11,799/month" |
| `price` | `price` | Numeric price | ❌ No | Integer value |
| `size` | `size` | Property size | ❌ No | Integer value (sq ft) |
| `beds` | `beds` | Bedrooms/BHK | ❌ No | String, e.g., "2 BHK" |
| `rating` | `rating` | Property rating | ❌ No | Decimal number, e.g., 4.5 |
| `tag` | `tag` | Property tag | ❌ No | String tag |
| `description` | `description` | Property description | ❌ No | Long text description |
| `propertyTier` | `propertyTier` | Property tier level | ❌ No | e.g., "Premium" |
| `displayOrder` | `displayOrder` | Display order number | ❌ No | Integer for sorting |
| `locationDetails` | `locationDetails` | Full address/location | ❌ No | Complete address string |
| `metroStationDistance` | `metroStationDistance` | First metro station distance | ❌ No | Distance string, e.g., "0.4 Km Walking Distance From MIDC Metro Station" |
| `metroStationDistance2` | `metroStationDistance` | Second metro station distance | ❌ No | Combined with metroStationDistance using " / " separator |
| `railwayStationDistance` | `railwayStationDistance` | First railway station distance | ❌ No | Distance string |
| `railwayStationDistance2` | `railwayStationDistance` | Second railway station distance | ❌ No | Combined with railwayStationDistance using " / " separator |
| `googleMapLink` | `googleMapLink` | Google Maps URL | ❌ No | Must be a valid URL (http:// or https://) |
| `workspaceName` | `workspaceName` | Workspace name | ❌ No | Name of the workspace |
| `monFriTime` | `workspaceTimings` | Monday-Friday timings | ❌ No | Combined into workspaceTimings field |
| `saturdayTime` | `workspaceTimings` | Saturday timings | ❌ No | Combined into workspaceTimings field |
| `sundayTime` | `workspaceTimings` | Sunday timings | ❌ No | Combined into workspaceTimings field |
| `workspaceClosedDays` | `workspaceClosedDays` | Closed days info | ❌ No | String, e.g., "Open" |
| `aboutWorkspace` | `aboutWorkspace` | About workspace description | ❌ No | Long text about the workspace |
| `capacity` | `capacity` | Seating capacity | ❌ No | Integer number |
| `superArea` | `superArea` | Super area in sq ft | ❌ No | Integer number |
| `propertyOptions` | `propertyOptions` | Seating plans/options | ❌ No | JSON or simplified format: "Title\|Description\|Price\|Seating" |

## Header Variations Supported

The system supports multiple header name variations. Here are the accepted formats:

### Location Fields:
- **locationDetails**: `locationDetails`, `location details`, `locationdetail`
- **metroStationDistance**: `metroStationDistance`, `metro station distance`, `metrostation`
- **metroStationDistance2**: `metroStationDistance2`, `metro station distance 2`, `metrostationdistance 2`, `metrostation2`
- **railwayStationDistance**: `railwayStationDistance`, `railway station distance`, `railwaystation`
- **railwayStationDistance2**: `railwayStationDistance2`, `railway station distance 2`, `railwaystationdistance 2`, `railwaystation2`
- **googleMapLink**: `googleMapLink`, `google map link`, `googlemap`, `maplink`

### Other Fields:
- **aboutWorkspace**: `aboutWorkspace`, `about workspace`, `about space`, `aboutwork`
- **workspaceName**: `workspaceName`, `workspace name`
- **propertyTier**: `propertyTier`, `property tier`

## Special Handling

### 1. Categories Column
- Accepts comma-separated values: `"coworking,managed,dedicateddesk"`
- Automatically handles commas within quoted values
- Prevents column shifting

### 2. Metro/Railway Distances
- `metroStationDistance` and `metroStationDistance2` are combined into single `metroStationDistance` field
- `railwayStationDistance` and `railwayStationDistance2` are combined into single `railwayStationDistance` field
- Combined format: `"Distance1 / Distance2"`

### 3. Workspace Timings
- `monFriTime`, `saturdayTime`, `sundayTime` are combined into `workspaceTimings`
- Format: `"Mon-Fri: 9 AM - 6 PM | Sat: 9 AM - 1 PM | Sun: Closed"`

### 4. Property Options (Seating Plans)
**Format 1 - Simplified:**
```
"Title|Description|Price|Seating;Title2|Description2|Price2|Seating2"
```
Example:
```
"Dedicated Desk|Get your dedicated desk...|11999|1-50;Flexi Desk|Just show up...|13000|1-50"
```

**Format 2 - JSON:**
```json
[{"title":"Dedicated Desk","description":"...","price":"11999","seating":"1-50"}]
```

### 5. Auto-Generated Fields
- **purpose**: Auto-generated from first category
  - coworking → COMMERCIAL
  - managed → COMMERCIAL
  - dedicateddesk → COMMERCIAL
  - etc.
- **type**: Auto-generated from first category
  - coworking → COWORKING
  - managed → MANAGED_OFFICE
  - etc.
- **amenities**: If not provided, all default amenities are selected automatically

### 6. Auto-Correction Logic
The system automatically fixes common data placement errors:
- If `locationDetails` is empty but `metroStationDistance` has location data → swaps them
- If `googleMapLink` is empty but workspace timing has URL → moves URL to `googleMapLink`
- If distance fields have location data → moves to `locationDetails`
- If `googleMapLink` has distance data → moves to appropriate distance field

## Example Excel Row

```
title,city,area,sublocation,type,categories,priceDisplay,price,size,beds,rating,tag,description,propertyTier,displayOrder,locationDetails,metroStationDistance,metroStationDistance2,railwayStationDistance,railwayStationDistance2,googleMapLink,workspaceName,monFriTime,saturdayTime,sundayTime,workspaceClosedDays,aboutWorkspace,capacity,superArea,propertyOptions
91Springboard - Lotus Star,Mumbai,Andheri East,MIDC,COWORKING,"coworking,managed,dedicateddesk","₹11,799/month",11799,1000,"2 BHK",4.5,Premium,Premium,0,"Plot No. D, 5th Rd...",0.4 Km Walking Distance From MIDC Metro Station,1.1 Km Walking Distance From Airport Road Metro Station,3.3 Km Drive From Andheri Railway Station,9.2 Km Drive From Ghatkopar Railway Station,https://maps.google.com/,Work Square - Sumer Plaza,12:00 AM to 11:59 PM,12:00 AM to 11:59 PM,Open,,"A) Provider offer...",220,10000,"Dedicated Desk|Get your Dedicated desk...|11999|1-50;Flexi Desk|Just show up...|13000|1-50"
```

