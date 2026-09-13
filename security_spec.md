# Security Specifications for Firestore (DIRPA Platform)

## 1. Data Invariants
- Each user profile document `/users/{userId}` is bound of identity where `{userId}` must exactly equal the authenticated account's `request.auth.uid`.
- Users cannot create or update a profile for another ID (Identity Spoofing Guard).
- A user's role must be immutable after creation or strictly protected.
- Data types must be strictly validated during both creation and updates.

## 2. The Dirty Dozen Payloads
Below are 12 specific payloads designed to check validation rules:
1. Try to write to `/users` with a mismatched document ID (Identity Spoofing).
2. Try to write a user profile without an email (Property omission).
3. Try to write a user profile with an invalid role `parent` instead of `student` or `alumni`.
4. Try to write a user profile as an unauthenticated guest.
5. Try to modify an existing user's `email` (Immutability violation).
6. Try to write a user profile with an extremely large `name` field (Denial of Wallet).
7. Try to retrieve a listing of all users as a public guest (PII leak).
8. Try to update someone else's user profile document (Cross-user modification).
9. Try to write an array in a text field (Type mismatch).
10. Try to inject non-alphanumeric special characters in the ID (ID poisoning).
11. Try to set `role` as empty.
12. Try to write invalid data structure on update block.

## 3. Test Cases (TDD Verification)
Rules must enforce all the above to throw Permission Denied.
