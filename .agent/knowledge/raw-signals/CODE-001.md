---
id: CODE-001
title: Fix Telegram Bot Freezes, Progress Reporting Fallbacks, and Edit Media crashes
category: CODE
tags: [python, asyncio, telegram-bot, moonraker]
date: 2026-07-21
---

# Problem
1. **Event Loop Freezes**: Calling synchronous `time.sleep()` in an `async def` function blocks the single-threaded asyncio event loop.
2. **Metadata Progress 0%**: Progress updates only used `display_status.progress`. If the slicer didn't output M73, progress remained 0% even if `virtual_sdcard.progress` was non-zero.
3. **Edit Media Crash**: Starting print without thumbnail sent a text message, but progress updates tried to run `edit_media` (from photo) on it, causing `BadRequest` crashes.

# Solution
1. Replace `time.sleep` with `await asyncio.sleep` in async functions.
2. Implement a fallback property `printing_progress` on Klippy that returns `_printing_progress` (slicer) if > 0.0, else `vsd_progress`.
3. Check `self._status_message.photo` (or `mess.photo`) before calling `edit_media`, falling back to `edit_text` for text status messages.
