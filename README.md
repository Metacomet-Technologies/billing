# Discord Bot SaaS Billing System

## Overview

This Laravel application implements a comprehensive billing system for a Discord Bot SaaS platform using Laravel Cashier with Stripe integration. The system supports both subscription-based and lifetime license billing models with full license assignment management to Discord guilds.

## Features

### 🎯 Core Functionality
- **Dual Billing Models**: Subscription and lifetime license support
- **Guild License Management**: Assign/park/transfer licenses between Discord guilds
- **Admin Permission Control**: Only license owners can manage their licenses
- **30-Day Transfer Cooldown**: Prevents abuse of license transfers
- **Automated Admin Verification**: Daily check to ensure license owners are still guild admins

### 🔧 Technical Implementation
- **Laravel 11** with **Laravel Cashier (Stripe)**
- **SQLite** for development, **MySQL** for production
- **Policy-based Authorization** for license management
- **Event-driven Architecture** for license state changes
- **Comprehensive Test Suite** with Pest

## Models & Relationships

### User Model
```php
- id, discord_id, email, name
- Billable trait for Stripe integration
- hasMany: licenses
- belongsToMany: guilds (with is_admin pivot)
```

### Guild Model
```php
- id, discord_id, name
- belongsToMany: users (with is_admin pivot)
- hasOne: activeLicense
```

### License Model
```php
- id, user_id, type, stripe_id, status, assigned_guild_id, last_assigned_at
- Types: 'subscription' | 'lifetime'
- Status: 'active' | 'parked'
- 30-day transfer cooldown enforcement
```

## API Routes

### Billing Endpoints
```
POST /billing/checkout/subscription  - Create subscription checkout
POST /billing/checkout/lifetime      - Create lifetime checkout
GET  /billing/portal                 - Stripe billing portal
GET  /billing/success               - Payment success handler
GET  /billing/cancel                - Payment cancellation handler
```

### License Management
```
GET    /licenses                    - List user's licenses
GET    /licenses/{id}               - Show specific license
PUT    /licenses/{id}               - Assign/park license
DELETE /licenses/{id}               - Delete license
GET    /licenses/guilds/available   - Get assignable guilds
```

## Business Rules

### License Assignment
1. **Ownership**: Only license owner can manage the license
2. **Admin Status**: User must be admin of target guild
3. **Transfer Cooldown**: 30 days between guild assignments
4. **Exclusive Assignment**: One active license per guild
5. **Auto-parking**: Licenses auto-park when admin status is lost

### Payment Processing
- **Subscriptions**: Auto-create license via webhook
- **Lifetime**: Create license on checkout completion
- **Cancellations**: Auto-park license when subscription ends

## Events System

### License Events
- `LicenseAssigned`: Fired when license is assigned to guild
- `LicenseParked`: Fired when license is removed from guild
- `LicenseTransferred`: Fired when license moves between guilds

## Security & Authorization

### License Policy
- `view`: License owner only
- `assign`: Owner + guild admin + cooldown check
- `park`: License owner + active status
- `transfer`: Same as assign

### Middleware Protection
- All license routes require authentication
- Policy enforcement via `authorize()` calls

## Stripe Integration

### Webhooks Handled
- `customer.subscription.created`: Create subscription license
- `checkout.session.completed`: Create lifetime license
- `customer.subscription.deleted`: Park cancelled subscription

### Checkout Configuration
- Metadata tracking for license type
- Success/cancel URL handling
- Automatic customer creation

## Development Setup

### 1. Installation
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### 2. Database Setup
```bash
touch database/database.sqlite
php artisan migrate
```

### 3. Stripe Configuration
```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_SUBSCRIPTION=price_...
STRIPE_PRICE_ID_LIFETIME=price_...
```

### 4. Testing
```bash
php artisan test
# or specifically
php artisan test tests/Feature/LicenseManagementTest.php
```

## Scheduled Tasks

### License Admin Verification
```bash
php artisan schedule:run
# or manually
php artisan licenses:verify-admin-status
```

Runs daily to verify license owners still have admin permissions for assigned guilds.

## Production Considerations

### Queue Configuration
- Use Redis/Database for reliable job processing
- Monitor webhook processing jobs
- Set up job failure alerts

### Discord Integration
- Implement Discord OAuth for user authentication
- Cache guild admin status for performance
- Handle Discord API rate limits

### Monitoring
- Track license assignment patterns
- Monitor payment failures
- Alert on policy violations

## Testing Strategy

### Feature Tests Cover
- License assignment/parking/transfer flows
- Policy enforcement scenarios
- Cooldown period validation
- Admin permission changes
- Edge cases (orphaned licenses, deleted guilds)

### Test Database
- Uses SQLite for fast test execution
- Full database refresh per test
- Factory-generated test data

## Extension Points

### Future Enhancements
- Multi-tier subscription plans
- Usage-based billing
- Guild member limits per license
- Discord bot feature toggles
- Analytics dashboard
- Reseller/white-label support

### Integration Hooks
- Discord webhook handlers
- Custom billing events
- Third-party payment processors
- Advanced admin verification (Discord API)

## Support & Maintenance

### Logging
- Stripe webhook events
- License state changes
- Policy violations
- Payment processing errors

### Backup Strategy
- Database backups
- Stripe data reconciliation
- License audit trails

This implementation provides a solid foundation for a Discord Bot SaaS billing system with room for future enhancements and scaling.
