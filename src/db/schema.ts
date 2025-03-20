import { relations } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    text,
    varchar,
    timestamp,
    boolean,
    integer,
    date,
    decimal,
    pgEnum,
} from 'drizzle-orm/pg-core';

export type IssueType = 'hvac' | 'plumbing' | 'other';
export type MaintenanceStatus = 'open' | 'closed';
export type ComplaintType = 'noise' | 'other';
export type PackageStatus = 'delivered' | 'retrieved';
export type AccessCodeType = 'resident' | 'guest';

export const issueTypeEnum = pgEnum('issue_type', ['hvac', 'plumbing', 'other']);
export const maintenanceStatusEnum = pgEnum('maintenance_status', ['open', 'closed']);
export const complaintTypeEnum = pgEnum('complaint_type', ['noise', 'other']);
export const packageStatusEnum = pgEnum('package_status', ['delivered', 'retrieved']);
export const accessCodeTypeEnum = pgEnum('access_code_type', ['resident', 'guest']);

// Column helpers
export const timestamps = {
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}

// Tables
export const buildings = pgTable('buildings', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    zip: text('zip').notNull(),
    ...timestamps
});

export const units = pgTable('units', {
    id: uuid('id').primaryKey().defaultRandom(),
    buildingId: uuid('building_id').references(() => buildings.id, { onDelete: 'cascade' }),
    unitNumber: integer('unit_number').notNull(),
    squareFeet: integer('square_feet'),
    vacant: boolean('vacant').default(true),
    ...timestamps
});

export const tenants = pgTable('tenants', {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    dob: date('dob'),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: text('phone'),
    userId: uuid('user_id'),
    ...timestamps
});

export const unitTenants = pgTable('unit_tenants', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').references(() => units.id, { onDelete: 'cascade' }),
    moveInDate: date('move_in_date').notNull(),
    moveOutDate: date('move_out_date'),
    isPrimary: boolean('is_primary').default(false),
    isActive: boolean('is_active').default(true),
    ...timestamps
});

export const leases = pgTable('leases', {
    id: uuid('id').primaryKey().defaultRandom(),
    unitTenantsId: uuid('unit_tenants_id').references(() => unitTenants.id, { onDelete: 'cascade' }),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    monthlyRate: decimal('monthly_rate', { precision: 10, scale: 2 }).notNull(),
    document: text('document'),
    status: text('status').notNull(),
    signature: boolean('signature').default(false),
    signedAt: timestamp('signed_at', { withTimezone: true, mode: 'date' }),
    ...timestamps
});

export const parkingPermits = pgTable('parking_permits', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    guestName: text('guest_name'),
    licensePlate: varchar('license_plate', { length: 20 }).notNull(),
    parkingSpace: integer('parking_space'),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    ...timestamps
});

export const maintenanceRequests = pgTable('maintenance_requests', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    unitId: uuid('unit_id').references(() => units.id, { onDelete: 'cascade' }),
    issueType: issueTypeEnum('issue_type').notNull(),
    description: text('description').notNull(),
    status: maintenanceStatusEnum('status').default('open'),
    resolution: text('resolution'),
    completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
    ...timestamps
});

export const complaints = pgTable('complaints', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    issueType: complaintTypeEnum('issue_type').notNull(),
    description: text('description').notNull(),
    priority: text('priority').notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true, mode: 'date' }),
    ...timestamps
});

export const accessCodes = pgTable('access_codes', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    type: accessCodeTypeEnum('type').notNull(),
    hashedCode: varchar('hashed_code', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
    isActive: boolean('is_active').default(true),
    ...timestamps
});

export const smartLockers = pgTable('smart_lockers', {
    id: uuid('id').primaryKey().defaultRandom(),
    buildingId: uuid('building_id').references(() => buildings.id, { onDelete: 'cascade' }),
    lockerNumber: integer('locker_number').notNull(),
    isOccupied: boolean('is_occupied').default(false),
    ...timestamps
});

export const packages = pgTable('packages', {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    lockerId: uuid('locker_id').references(() => smartLockers.id),
    lockerCode: varchar('locker_code', { length: 10 }),
    status: packageStatusEnum('status').default('delivered'),
    deliveryTime: timestamp('delivery_time', { withTimezone: true, mode: 'date' }),
    ...timestamps
});

// Inferred types for retrieval and insertion operations
export type BuildingSelectType = typeof buildings.$inferSelect;
export type BuildingInsertType = typeof buildings.$inferInsert;

export type UnitSelectType = typeof units.$inferSelect;
export type UnitInsertType = typeof units.$inferInsert;

export type TenantSelectType = typeof tenants.$inferSelect;
export type TenantInsertType = typeof tenants.$inferInsert;

export type UnitTenantSelectType = typeof unitTenants.$inferSelect;
export type UnitTenantInsertType = typeof unitTenants.$inferInsert;

export type LeaseSelectType = typeof leases.$inferSelect;
export type LeaseInsertType = typeof leases.$inferInsert;

export type ParkingPermitSelectType = typeof parkingPermits.$inferSelect;
export type ParkingPermitInsertType = typeof parkingPermits.$inferInsert;

export type MaintenanceRequestSelectType = typeof maintenanceRequests.$inferSelect;
export type MaintenanceRequestInsertType = typeof maintenanceRequests.$inferInsert;

export type ComplaintSelectType = typeof complaints.$inferSelect;
export type ComplaintInsertType = typeof complaints.$inferInsert;

export type AccessCodeSelectType = typeof accessCodes.$inferSelect;
export type AccessCodeInsertType = typeof accessCodes.$inferInsert;

export type SmartLockerSelectType = typeof smartLockers.$inferSelect;
export type SmartLockerInsertType = typeof smartLockers.$inferInsert;

export type PackageSelectType = typeof packages.$inferSelect;
export type PackageInsertType = typeof packages.$inferInsert;


// Table Relations
export const buildingsRelations = relations(buildings, ({ many }) => ({
    units: many(units),
    smartLockers: many(smartLockers),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
    building: one(buildings, {
        fields: [units.buildingId],
        references: [buildings.id],
    }),
    unitTenants: many(unitTenants),
    maintenanceRequests: many(maintenanceRequests),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
    unitTenants: many(unitTenants),
    parkingPermits: many(parkingPermits),
    maintenanceRequests: many(maintenanceRequests),
    complaints: many(complaints),
    accessCodes: many(accessCodes),
    packages: many(packages),
}));

export const unitTenantsRelations = relations(unitTenants, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [unitTenants.tenantId],
        references: [tenants.id],
    }),
    unit: one(units, {
        fields: [unitTenants.unitId],
        references: [units.id],
    }),
    leases: many(leases),
}));

export const leasesRelations = relations(leases, ({ one }) => ({
    unitTenant: one(unitTenants, {
        fields: [leases.unitTenantsId],
        references: [unitTenants.id],
    }),
}));

export const maintenanceRequestsRelations = relations(maintenanceRequests, ({ one }) => ({
    unit: one(units, {
        fields: [maintenanceRequests.unitId],
        references: [units.id],
    }),
    tenant: one(tenants, {
        fields: [maintenanceRequests.tenantId],
        references: [tenants.id],
    }),
}));

export const smartLockersRelations = relations(smartLockers, ({ one, many }) => ({
    building: one(buildings, {
        fields: [smartLockers.buildingId],
        references: [buildings.id],
    }),
    packages: many(packages),
}));

export const packagesRelations = relations(packages, ({ one }) => ({
    tenant: one(tenants, {
        fields: [packages.tenantId],
        references: [tenants.id],
    }),
    smartLocker: one(smartLockers, {
        fields: [packages.lockerId],
        references: [smartLockers.id],
    })
}));