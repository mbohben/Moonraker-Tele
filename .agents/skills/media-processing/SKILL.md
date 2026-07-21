---
name: media-processing
description: >-
  Process video, audio, and images with FFmpeg, ImageMagick, and RMBG.
  Use when converting, compressing, resizing media files, or removing backgrounds.
  NOT for UI image assets (use design-system) or prompt-based generation (use ai-artist).
metadata:
  author: pikakit
  version: "3.9.206"
  category: devops
  triggers: "video, audio, image, compress, resize, convert, ffmpeg, imagemagick, rmbg"
  coordinates_with: "perf-optimizer, studio"
---

# Media Processing — FFmpeg + ImageMagick + RMBG

> 3 tools. Fixed CRF. Fixed JPEG quality. Destructive always flagged.

---

## Prerequisites

```bash
# macOS
brew install ffmpeg imagemagick
npm install -g rmbg-cli

# Ubuntu
sudo apt-get install ffmpeg imagemagick
npm install -g rmbg-cli
```

---

## When to Use

| Task | Tool |
|------|------|
| Video encoding/conversion | FFmpeg |
| Audio extraction | FFmpeg |
| GIF from video | FFmpeg |
| Image resize/compress | ImageMagick |
| Background removal | RMBG |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tool selection (3 tools) | Performance profiling (→ perf-optimizer) |
| Command generation | Design assets (→ studio) |
| Quality parameter guidance | Tool installation |
| Destructive warnings | Command execution |

**Expert decision skill:** Produces commands and recommendations. Does not execute.

---

## Tool Routing (Deterministic)

| Task Type | Tool |
|-----------|------|
| Video / audio | **FFmpeg** |
| Image | **ImageMagick** |
| Background removal | **RMBG** |

---

## Video (FFmpeg)

```bash
# Convert with web optimization
ffmpeg -i input.mov -c:v libx264 -crf 22 -movflags +faststart output.mp4

# Extract audio
ffmpeg -i video.mp4 -vn -c:a copy audio.m4a

# Thumbnail at 5s
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumb.jpg
```

### CRF Quality Guide (Fixed)

| CRF | Tier | Use Case |
|-----|------|----------|
| 18 | Visually lossless | Archival, source preservation |
| 22 | Recommended | General purpose (default) |
| 28 | Smaller file | Web delivery, previews |

**Always include:** `-movflags +faststart` for MP4.

---

## Image (ImageMagick)

```bash
# Resize (maintain aspect)
magick input.jpg -resize 800x600 output.jpg

# Compress JPEG (quality 85, strip EXIF)
magick input.jpg -quality 85 -strip output.jpg

# ⚠️ Batch resize (DESTRUCTIVE — modifies in-place)
mogrify -resize 800x -quality 85 *.jpg
```

**Default JPEG quality:** 85. **Always include:** `-strip` for EXIF removal.

**⚠️ mogrify:** Always backup first. Test on single file before batch.

---

## Background Removal (RMBG)

```bash
rmbg input.jpg -o output.png            # Default model
rmbg input.jpg -m briaai -o output.png   # Highest quality
```

### Model Selection (Fixed)

| Priority | Model | Quality | Speed |
|----------|-------|---------|-------|
| Quality | **briaai** | Highest | Slow |
| Speed | **u2netp** | Good | Fast |
| Balanced | **modnet** | Balanced | Medium |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_UNKNOWN_TASK` | No | Task type not supported |
| `ERR_MISSING_FORMAT` | Yes | Format not provided |
| `ERR_UNSUPPORTED_FORMAT` | No | Format pair not supported |
| `ERR_INVALID_QUALITY` | Yes | Quality tier not recognized |
| `WARN_DESTRUCTIVE` | Yes | mogrify in-place modification |

**Zero internal retries.** Deterministic; same context = same command.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use mogrify without backup | Backup originals first |
| Skip `-movflags +faststart` for MP4 | Always include for web |
| Use default CRF without thinking | Choose 18/22/28 based on use case |
| Batch process without testing | Test on single file first |
| Skip `-strip` for JPEG | Always strip EXIF metadata |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `perf-optimizer` | Skill | Performance profiling |
| `studio` | Skill | Design assets |

---

⚡ PikaKit v3.9.206
