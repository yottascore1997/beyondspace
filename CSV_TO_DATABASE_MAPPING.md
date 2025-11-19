# CSV Column to Database Column Mapping

## CSV Header (Template Order):
```
title, city, area, sublocation, type, categories, priceDisplay, price, size, beds, rating, tag, description, propertyTier, displayOrder, locationDetails, metroStationDistance, metroStationDistance2, railwayStationDistance, railwayStationDistance2, googleMapLink, workspaceName, monFriTime, saturdayTime, sundayTime, workspaceClosedDays, aboutWorkspace, capacity, superArea, propertyOptions
```

## Database Columns (from Prisma Schema):

### Required Fields:
- `id` - Auto-generated (CUID)
- `title` ← CSV: `title`
- `city` ← CSV: `city`
- `area` ← CSV: `area`
- `purpose` ← **AUTO-GENERATED** from categories (not in CSV)
- `type` ← CSV: `type` (or auto-generated from categories)
- `displayOrder` ← CSV: `displayOrder` (default: 0)
- `categories` ← CSV: `categories` (JSON array)
- `priceDisplay` ← CSV: `priceDisplay`
- `price` ← CSV: `price` (integer)
- `size` ← CSV: `size` (integer)
- `beds` ← CSV: `beds` (string)
- `rating` ← CSV: `rating` (float)
- `image` ← **EMPTY** (will be added via edit)
- `userId` ← From auth token
- `isActive` ← Default: true
- `createdAt` ← Auto-generated
- `updatedAt` ← Auto-generated

### Optional Fields:
- `sublocation` ← CSV: `sublocation`
- `tag` ← CSV: `tag`
- `description` ← CSV: `description`
- `workspaceName` ← CSV: `workspaceName`
- `workspaceTimings` ← **COMBINED** from CSV: `monFriTime`, `saturdayTime`, `sundayTime`
- `workspaceClosedDays` ← CSV: `workspaceClosedDays`
- `amenities` ← **AUTO-ADDED** (all default amenities)
- `locationDetails` ← CSV: `locationDetails`
- `metroStationDistance` ← **COMBINED** from CSV: `metroStationDistance` + `metroStationDistance2`
- `railwayStationDistance` ← **COMBINED** from CSV: `railwayStationDistance` + `railwayStationDistance2`
- `googleMapLink` ← CSV: `googleMapLink` (max 191 chars)
- `propertyTier` ← CSV: `propertyTier`
- `aboutWorkspace` ← CSV: `aboutWorkspace`
- `capacity` ← CSV: `capacity` (integer)
- `superArea` ← CSV: `superArea` (integer)
- `propertyOptions` ← CSV: `propertyOptions` (JSON array - seating plans)
- `officeTiming` ← Always null (not used)

## Mapping Issues to Check:

### CSV Column Order:
1. `title` → `title` ✓
2. `city` → `city` ✓
3. `area` → `area` ✓
4. `sublocation` → `sublocation` ✓
5. `type` → `type` ✓
6. `categories` → `categories` ✓
7. `priceDisplay` → `priceDisplay` ✓
8. `price` → `price` ✓
9. `size` → `size` ✓
10. `beds` → `beds` ✓
11. `rating` → `rating` ✓
12. `tag` → `tag` ✓
13. `description` → `description` ✓
14. `propertyTier` → `propertyTier` ✓
15. `displayOrder` → `displayOrder` ✓
16. `locationDetails` → `locationDetails` ✓
17. `metroStationDistance` → Combined with `metroStationDistance2` → `metroStationDistance` ✓
18. `metroStationDistance2` → Combined with `metroStationDistance` → `metroStationDistance` ✓
19. `railwayStationDistance` → Combined with `railwayStationDistance2` → `railwayStationDistance` ✓
20. `railwayStationDistance2` → Combined with `railwayStationDistance` → `railwayStationDistance` ✓
21. `googleMapLink` → `googleMapLink` ✓
22. `workspaceName` → `workspaceName` ✓
23. `monFriTime` → Combined → `workspaceTimings` ✓
24. `saturdayTime` → Combined → `workspaceTimings` ✓
25. `sundayTime` → Combined → `workspaceTimings` ✓
26. `workspaceClosedDays` → `workspaceClosedDays` ✓
27. `aboutWorkspace` → `aboutWorkspace` ✓
28. `capacity` → `capacity` ✓
29. `superArea` → `superArea` ✓
30. `propertyOptions` → `propertyOptions` ✓

## Common Issues:

1. **CSV Parsing**: If CSV has commas in quoted values, parsing might shift columns
2. **Column Order**: Must match exactly with header
3. **Quoted Values**: Values with commas must be quoted
4. **Empty Values**: Empty cells should be empty strings, not null

## Debugging:

Check browser console (development mode) for:
- `[Row X] Raw CSV Data:` - Shows what was parsed from CSV
- `[Row X] Final Property Data:` - Shows what's being saved to database

Compare these to identify where data is shifting.

