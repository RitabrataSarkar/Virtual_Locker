# Drag and Drop File Moving Feature

## Overview
Users can now drag and drop files and folders to move them between directories. This provides an intuitive way to organize files without using menus or dialogs.

## How It Works

### User Experience
1. **Drag a file or folder** - Click and hold on any file or folder row
2. **Drag over a target folder** - The folder will highlight in blue
3. **Drop to move** - Release to move the item into that folder
4. **Visual feedback** - The dragged item becomes semi-transparent

### Features
- ✅ Drag files into folders
- ✅ Drag folders into other folders
- ✅ Visual feedback during drag (blue highlight on drop target)
- ✅ Prevents moving folders into themselves
- ✅ Prevents circular folder structures
- ✅ Toast notifications for success/failure
- ✅ Automatic refresh after move

## Implementation Details

### 1. Move API Endpoint
**File**: `app/api/files/[fileId]/move/route.ts`

```typescript
POST /api/files/[fileId]/move
Body: { targetFolderId: string | null }
```

**Validations:**
- Checks if target folder exists
- Prevents moving a folder into itself
- Prevents creating circular dependencies (moving folder into its own subfolder)
- Ensures user owns both source and target

### 2. Frontend Hook
**File**: `hooks/useFiles.ts`

Added new `moveFile` function:
```typescript
const moveFile = async (fileId: string, targetFolderId: string | null): Promise<FileItem>
```

### 3. FileList Component
**File**: `components/file-manager/FileList.tsx`

**State Management:**
- `draggedItem` - Tracks which item is being dragged
- `dropTarget` - Tracks which folder is being dragged over

**Drag Handlers:**
- `handleDragStart` - Initiates drag operation
- `handleDragOver` - Validates and highlights drop target
- `handleDragLeave` - Removes highlight
- `handleDrop` - Executes the move operation
- `handleDragEnd` - Cleans up drag state

**Visual Feedback:**
```typescript
className={cn(
    'hover:bg-gray-50 transition-colors cursor-pointer',
    item.isFolder && 'hover:bg-amber-50',
    draggedItem?._id === item._id && 'opacity-50',  // Dragged item
    dropTarget === item._id && item.isFolder && 'bg-blue-50 border-2 border-blue-400'  // Drop target
)}
```

### 4. Dashboard Integration
**File**: `app/dashboard/page.tsx`

```typescript
const handleMove = async (fileId: string, targetFolderId: string | null) => {
    try {
        await moveFile(fileId, targetFolderId);
        toast.success('Moved successfully');
        loadFiles();
    } catch (error: any) {
        toast.error(error.message || 'Failed to move');
    }
};
```

## Security & Validation

### Backend Validation
1. **Ownership Check** - Both source and target must belong to the user
2. **Folder Existence** - Target folder must exist
3. **Self-Reference Prevention** - Cannot move folder into itself
4. **Circular Dependency Prevention** - Cannot move folder into its descendants

### Example Prevention Logic
```typescript
// Check if target is a descendant of the source folder
let currentFolder = await File.findById(targetFolderId);
while (currentFolder && currentFolder.parentId) {
    if (currentFolder.parentId.toString() === fileId) {
        return error('Cannot move a folder into its own subfolder');
    }
    currentFolder = await File.findById(currentFolder.parentId);
}
```

## User Interface

### Visual States

**Normal File Row:**
```
📄 document.pdf    PDF    1.2 MB    Today, 2:30 PM    [⋮]
```

**While Dragging:**
```
📄 document.pdf ← 50% opacity, draggable cursor
```

**Drop Target Folder (highlighted):**
```
┌─────────────────────────────────────────────────────┐
│ 📁 Projects ← BLUE BACKGROUND + BLUE BORDER         │
└─────────────────────────────────────────────────────┘
```

## Error Handling

### Possible Errors
- **"Target folder not found"** - Folder doesn't exist or was deleted
- **"Cannot move a folder into itself"** - Attempted self-reference
- **"Cannot move a folder into its own subfolder"** - Circular dependency
- **"Failed to move file"** - General server error

### User Feedback
- ✅ **Success**: Green toast - "Moved successfully"
- ❌ **Failure**: Red toast with specific error message

## Testing Scenarios

### Happy Path
1. Create a folder "Documents"
2. Upload a PDF file in root
3. Drag the PDF onto "Documents" folder
4. ✅ File moves into Documents
5. Navigate into Documents
6. ✅ File appears there

### Edge Cases
1. **Self-move Prevention**:
   - Drag "Projects" folder onto itself
   - ❌ Nothing happens (prevented at UI level)

2. **Circular Prevention**:
   - Folder structure: Projects > Web > React
   - Try to drag "Projects" into "React"
   - ❌ Backend returns error

3. **Quick Movements**:
   - Drag file, drop, immediately drag another
   - ✅ State resets properly between operations

## Browser Compatibility

Drag and Drop API is supported in all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (with touch events)

## Future Enhancements

Potential improvements:
1. **Multi-select & move** - Drag multiple items at once
2. **Breadcrumb drop targets** - Drop on breadcrumb folders
3. **Keyboard shortcuts** - Cut/paste with Ctrl+X, Ctrl+V
4. **Undo move** - Revert last move operation
5. **Move preview** - Show where item will land
6. **Ghost image** - Custom drag preview image

## Files Modified

1. ✅ `app/api/files/[fileId]/move/route.ts` - Move API endpoint
2. ✅ `hooks/useFiles.ts` - Added moveFile function
3. ✅ `components/file-manager/FileList.tsx` - Drag & drop handlers
4. ✅ `app/dashboard/page.tsx` - Handle Move integration

## Performance Considerations

- **Minimal re-renders** - State updates only affect dragged/target items
- **Optimistic UI** - Could add optimistic updates (move immediately, revert on error)
- **Debouncing** - dragOver events could be debounced if needed
- **Large lists** - Virtualization could improve performance with 1000+ files

## Accessibility

### Current State
- Keyboard users cannot use drag & drop
- Screen readers don't announce drag states

### Recommended Improvements
1. Add keyboard shortcuts (Cut/Paste)
2. Add ARIA labels for drag states
3. Add "Move to" button in dropdown menu as alternative
4. Announce move completion to screen readers

---

**Status**: ✅ Implemented and working  
**Version**: 1.0  
**Last Updated**: 2026-01-22
