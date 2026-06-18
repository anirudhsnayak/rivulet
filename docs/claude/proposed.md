# Proposed Changes

Deferred improvements to consider for future implementation.

---

## Clear stale channels/members when switching servers

**Date proposed:** 2026-06-18

**Problem:** When a user clicks a different server icon, `setCurrentGuildById` is dispatched synchronously but `reloadChannels()` and `reloadMembers()` are async (fire-and-forget). During this brief window, the `ChannelList` and `MemberList` continue to display the previous server's data before the new data loads.

**Proposed fix:** In the `setCurrentGuildById` reducer in [src/stores/slices/UserSlice.ts](../../src/stores/slices/UserSlice.ts), reset `visibleChannels` and `visibleMembers` to empty arrays:

```diff
setCurrentGuildById: (state, action: PayloadAction<number>) => {
    state.currentGuildId = action.payload;
+   state.visibleChannels = [];
+   state.visibleMembers = [];
},
```

**Why this works:** The dispatch is synchronous, so React re-renders with empty channels/members immediately when the server changes. Within milliseconds, `reloadChannels()` and `reloadMembers()` resolve and populate the correct data. This is functionally correct because the previous guild's data is no longer valid.

**Trade-off:** The channels and members panels briefly flash empty instead of showing stale data. If a loading spinner is added later, this would be the natural place to set a loading flag.

**Related:** `ServerAPI.ts` creates a new server and calls `reloadChannels()` but not `reloadMembers()`. If this fix is applied, new servers would always show empty members until that gap is also closed.
