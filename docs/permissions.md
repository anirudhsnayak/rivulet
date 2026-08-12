# Server permissions

Roles are scoped to each server. Members can read and send messages. Admins
and creators can also create/delete channels and kick users. Only the current
creator can assign or revoke admin status in **Server Settings**, available in
the server-name dropdown. The creator cannot be kicked, demoted, or replaced
through the role endpoint. Users leave voluntarily through **Leave Server**.

A creator can transfer ownership to another current member in **Server Settings**
at any time. The successor becomes creator and the previous owner stays as an
admin. Only the current creator can transfer ownership; the target must be a
different current member. Ownership and both roles change atomically.

A creator must select another current member when leaving. The transfer and
departure happen together: the successor becomes creator and the previous
owner loses membership. A sole creator must invite a successor before leaving.
Kicked users can rejoin with an invite, with the member role.

The local database persists membership roles and checks permissions on every
operation, including channel/server consistency and membership for message
access. Legacy snapshots have no creator information: the earliest stored
member in each server becomes creator and everyone else becomes a member.

## External PostgreSQL API contract

The PostgreSQL service is maintained outside this repository. The frontend
calls the following endpoints when `API_MODE` is `psql`; the service must
implement these operations and enforce the same rules using the authenticated
session. Frontend visibility checks are not a security boundary. The local
database is a development adapter, not a production authorization service.

- `POST /api/user`: each server includes `role` for the current user.
- `GET /api/member?serverId=...`: each member includes `role`.
- `POST /api/server/`: creates a server with the current user as creator.
- `POST /api/server/join`: assigns new members the member role.
- `POST /api/channel/`: requires admin or creator membership.
- `DELETE /api/channel`: JSON `{ serverId, channelId }`; requires admin or
  creator membership and deletes the channel and its messages.
- `POST /api/member/kick`: JSON `{ serverId, userId }`; requires admin or
  creator membership; rejects the creator and the acting user as targets.
- `PATCH /api/member/role`: JSON `{ serverId, userId, role }`; requires creator
  membership and accepts only `member` or `admin` for non-creator targets.
- `POST /api/server/ownership`: JSON `{ serverId, successorUserId }`; requires
  creator membership and a different current member as successor. Atomically
  make the successor creator and the previous owner admin, retaining both
  memberships.
- `POST /api/server/leave`: JSON `{ serverId, successorUserId? }`; a creator
  must supply a different current member as successor. Validate, transfer
  ownership, and remove the departing membership in one transaction.

Roles are `member`, `admin`, or `creator`. Each server has exactly one creator.
All channel/message/member reads and message sends require membership. Channel
operations must verify the channel belongs to the supplied server. Reject
unauthorized requests with a non-success HTTP status.
