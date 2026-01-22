# Programming Files Support

## Overview
Added support for common programming and code files to the File Manager. Developers can now upload, store, and manage their source code files alongside documents and media.

## Supported Programming File Types

### C/C++
- ✅ `.c` - C source files
- ✅ `.cpp` - C++ source files
- ✅ `.h` - C/C++ header files
- ✅ `.hpp` - C++ header files

### Java
- ✅ `.java` - Java source files

### Python
- ✅ `.py` - Python source files

### Web Development
- ✅ `.html` - HTML files
- ✅ `.css` - CSS stylesheets
- ✅ `.js` - JavaScript files
- ✅ `.jsx` - React JSX files
- ✅ `.ts` - TypeScript files
- ✅ `.tsx` - React TypeScript files

### Data & Configuration
- ✅ `.json` - JSON data files
- ✅ `.xml` - XML files
- ✅ `.sql` - SQL scripts

### Scripts
- ✅ `.sh` - Shell scripts
- ✅ `.bat` - Batch files

## Complete Allowed File Types List

### Images
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)

### Documents
- PDF (`.pdf`)
- Text (`.txt`)
- Microsoft Word (`.doc`, `.docx`)

### Spreadsheets
- Microsoft Excel (`.xls`, `.xlsx`)

### Presentations
- Microsoft PowerPoint (`.ppt`, `.pptx`)

### Videos
- MP4 (`.mp4`)

### Archives
- ZIP (`.zip`)

### Programming (NEW! ✨)
- **18 programming file types** added
- All major languages supported
- Web development files included
- Configuration and data files supported

## Use Cases

### 1. Code Repository Backup
```
Upload your project files:
Home/
├── Projects/
│   ├── WebApp/
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── app.js
│   │   └── config.json
│   └── Backend/
│       ├── server.py
│       └── database.sql
```

### 2. Learning Materials
```
Store coding tutorials and examples:
Home/
├── Learning/
│   ├── C-Tutorial/
│   │   ├── hello.c
│   │   └── pointers.c
│   ├── Java-Examples/
│   │   └── Example.java
│   └── Web-Dev/
│       ├── sample.html
│       └── script.js
```

### 3. Portfolio Projects
```
Keep your portfolio code organized:
Home/
├── Portfolio/
│   ├── React-App/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── package.json
│   └── Python-Scripts/
│       ├── analyzer.py
│       └── config.json
```

## Implementation Details

### 1. Frontend Validation (`lib/utils.ts`)

**Updated ALLOWED_FILE_EXTENSIONS:**
```typescript
export const ALLOWED_FILE_EXTENSIONS = [
  // ... existing types
  
  // Programming - C/C++
  '.c', '.cpp', '.h', '.hpp',
  
  // Programming - Java
  '.java',
  
  // Programming - Python
  '.py',
  
  // Programming - Web
  '.html', '.css', '.js', '.jsx', '.ts', '.tsx',
  
  // Programming - Other
  '.json', '.xml', '.sql', '.sh', '.bat',
];
```

**Updated Error Message:**
```typescript
export function getAllowedFileTypesMessage(): string {
  const types = [
    'Images (JPEG, JPG, PNG)',
    'Documents (PDF, TXT, Word)',
    'Spreadsheets (Excel)',
    'Presentations (PowerPoint)',
    'Videos (MP4)',
    'Archives (ZIP)',
    'Code (C, C++, Java, Python, HTML, CSS, JS, TS, JSON, SQL)', // NEW!
  ];
  return `Only the following file types are allowed: ${types.join(', ')}`;
}
```

### 2. Backend Validation (`app/api/files/route.ts`)

**Server-Side Security:**
```typescript
const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.pdf', '.txt', '.doc', '.docx', 
    '.xls', '.xlsx', '.ppt', '.pptx', '.mp4', '.zip',
    '.c', '.cpp', '.h', '.hpp', '.java', '.py',
    '.html', '.css', '.js', '.jsx', '.ts', '.tsx',
    '.json', '.xml', '.sql', '.sh', '.bat'
];
```

### 3. File Upload UI (`components/file-manager/FileUpload.tsx`)

**Updated Accept Attribute:**
```html
<input
    type="file"
    accept=".jpg,.jpeg,.png,...,.c,.cpp,.java,.py,.html,.css,.js,.ts,..."
/>
```

**Updated UI Text:**
```
Images, Documents, Office files, Videos, Archives, Code files
```

## File Size Limits

All programming files are subject to the same size limit:
- **Maximum**: 50 MB (configurable via `MAX_FILE_SIZE` env variable)

## Security Considerations

### Safe to Upload ✅
- Source code files (`.c`, `.java`, `.py`, etc.)
- Web files (`.html`, `.css`, `.js`)
- Config files (`.json`, `.xml`)
- Scripts (`.sh`, `.bat`)

### Why Scripts Are Allowed
- Files are **stored**, not **executed**
- No server-side execution
- Download-only access
- User's responsibility to scan before running

### Best Practices
1. ⚠️ **Don't upload sensitive credentials** in config files
2. ⚠️ **Review scripts before running** after download
3. ✅ **Use for backup and storage** purposes
4. ✅ **Organize by project** in folders

## Examples

### Uploading a React Project
```
1. Create folder: "MyReactApp"
2. Upload files:
   - App.tsx ✅
   - App.css ✅
   - index.html ✅
   - package.json ✅
3. Download when needed
```

### Uploading Python Scripts
```
1. Create folder: "Python Scripts"
2. Upload:
   - main.py ✅
   - utils.py ✅
   - config.json ✅
3. Organized and backed up!
```

### Web Development Files
```
Project Structure:
Website/
├── index.html ✅
├── styles.css ✅
├── script.js ✅
└── data.json ✅
```

## File Type Detection

Programming files are automatically detected by extension:
- `.py` → Shows as "PY" badge
- `.js` → Shows as "JS" badge
- `.cpp` → Shows as "CPP" badge
- `.java` → Shows as "JAVA" badge

## Icon Display

All programming files currently show the **code icon** (📄) in the file list. The system uses the `file-code` icon for:
- `.js`, `.ts`, `.jsx`, `.tsx`
- `.py`, `.java`, `.c`, `.cpp`
- `.html`, `.css`
- `.json`, `.xml`, `.sql`

## Download & Open

**After Download:**
- Double-click opens in default editor
- Windows: Notepad, VS Code, etc.
- Mac: TextEdit, VS Code, etc.
- Linux: gedit, vim, VS Code, etc.

## Mime Types

Common MIME types for code files:
- `.js` → `application/javascript`
- `.json` → `application/json`
- `.html` → `text/html`
- `.css` → `text/css`
- `.py` → `text/x-python`
- `.java` → `text/x-java`
- `.c` → `text/x-c`
- `.xml` → `application/xml`

## Statistics

**Before Update:**
- 13 file types supported
- Focus: Documents, Media, Archives

**After Update:**
- 31 file types supported (+138%!)
- Added: 18 programming file types
- Coverage: All major programming languages

## Testing

### Tested File Types
- [x] ✅ C files (`.c`, `.h`)
- [x] ✅ C++ files (`.cpp`, `.hpp`)
- [x] ✅ Java files (`.java`)
- [x] ✅ Python files (`.py`)
- [x] ✅ HTML files (`.html`)
- [x] ✅ CSS files (`.css`)
- [x] ✅ JavaScript files (`.js`, `.jsx`)
- [x] ✅ TypeScript files (`.ts`, `.tsx`)
- [x] ✅ JSON files (`.json`)
- [x] ✅ XML files (`.xml`)
- [x] ✅ SQL files (`.sql`)
- [x] ✅ Shell scripts (`.sh`)
- [x] ✅ Batch files (`.bat`)

### Upload Tests
- [x] File picker filters correctly
- [x] Drag & drop accepts code files
- [x] Validation works on frontend
- [x] Validation works on backend
- [x] Error messages are clear
- [x] Downloads preserve extensions
- [x] Files organize in folders

## Files Modified

1. ✅ `lib/utils.ts` - Added 18 new extensions
2. ✅ `app/api/files/route.ts` - Backend validation
3. ✅ `components/file-manager/FileUpload.tsx` - UI updates

## Future Enhancements

Potential improvements:
1. **Syntax highlighting preview** - View code with colors
2. **Code editor integration** - Edit files in browser
3. **Git integration** - Track changes
4. **Search code content** - Search within files
5. **More languages** - Go, Rust, Ruby, PHP, etc.
6. **Code snippets** - Quick templates
7. **Markdown support** - `.md` files with preview

## Developer Benefits

✅ **Backup your code** - Store projects safely  
✅ **Share code easily** - Send file links to team  
✅ **Organize by project** - Folder structure  
✅ **Access anywhere** - Cloud storage  
✅ **Version snapshots** - Upload different versions  

---

**Status**: ✅ Implemented  
**Total File Types**: 31 (was 13)  
**Programming Languages**: C, C++, Java, Python, JavaScript, TypeScript, HTML, CSS, SQL  
**Last Updated**: 2026-01-22
