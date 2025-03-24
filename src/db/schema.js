"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packagesRelations = exports.smartLockersRelations = exports.maintenanceRequestsRelations = exports.leasesRelations = exports.unitTenantsRelations = exports.tenantsRelations = exports.unitsRelations = exports.buildingsRelations = exports.packages = exports.smartLockers = exports.accessCodes = exports.complaints = exports.maintenanceRequests = exports.parkingSpaces = exports.parkingPermits = exports.leases = exports.unitTenants = exports.tenants = exports.units = exports.buildings = exports.timestamps = exports.accessCodeTypeEnum = exports.packageStatusEnum = exports.complaintTypeEnum = exports.maintenanceStatusEnum = exports.complaintCategoryEnum = exports.issueTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
//This will be replaced by complaint category type
exports.issueTypeEnum = (0, pg_core_1.pgEnum)("issue_type", [
    "hvac",
    "plumbing",
    "other",
]);
exports.complaintCategoryEnum = (0, pg_core_1.pgEnum)("complaint_category", [
    "noise",
    "maintenance",
    "building_issues",
    "neighbor_disputes",
    "package_issues",
    "other",
]);
exports.maintenanceStatusEnum = (0, pg_core_1.pgEnum)("maintenance_status", [
    "open",
    "closed",
]);
exports.complaintTypeEnum = (0, pg_core_1.pgEnum)("complaint_type", ["noise", "other"]);
exports.packageStatusEnum = (0, pg_core_1.pgEnum)("package_status", [
    "delivered",
    "retrieved",
]);
exports.accessCodeTypeEnum = (0, pg_core_1.pgEnum)("access_code_type", [
    "resident",
    "guest",
]);
// Column helpers
exports.timestamps = {
    updatedAt: (0, pg_core_1.timestamp)("updated_at", {
        withTimezone: true,
        mode: "date",
    }).defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: "date" })
        .defaultNow()
        .notNull(),
};
// Tables
exports.buildings = (0, pg_core_1.pgTable)("buildings", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), name: (0, pg_core_1.text)("name").notNull(), address: (0, pg_core_1.text)("address").notNull(), city: (0, pg_core_1.text)("city").notNull(), state: (0, pg_core_1.text)("state").notNull(), zip: (0, pg_core_1.text)("zip").notNull() }, exports.timestamps));
exports.units = (0, pg_core_1.pgTable)("units", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), buildingId: (0, pg_core_1.uuid)("building_id").references(() => exports.buildings.id, {
        onDelete: "cascade",
    }), unitNumber: (0, pg_core_1.integer)("unit_number").notNull(), squareFeet: (0, pg_core_1.integer)("square_feet"), vacant: (0, pg_core_1.boolean)("vacant").default(true) }, exports.timestamps));
exports.tenants = (0, pg_core_1.pgTable)("tenants", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), firstName: (0, pg_core_1.text)("first_name").notNull(), lastName: (0, pg_core_1.text)("last_name").notNull(), dob: (0, pg_core_1.date)("dob"), email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(), phone: (0, pg_core_1.text)("phone"), userId: (0, pg_core_1.uuid)("user_id") }, exports.timestamps));
exports.unitTenants = (0, pg_core_1.pgTable)("unit_tenants", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, {
        onDelete: "cascade",
    }), unitId: (0, pg_core_1.uuid)("unit_id").references(() => exports.units.id, { onDelete: "cascade" }), moveInDate: (0, pg_core_1.date)("move_in_date").notNull(), moveOutDate: (0, pg_core_1.date)("move_out_date"), isPrimary: (0, pg_core_1.boolean)("is_primary").default(false), isActive: (0, pg_core_1.boolean)("is_active").default(true) }, exports.timestamps));
exports.leases = (0, pg_core_1.pgTable)("leases", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), unitTenantsId: (0, pg_core_1.uuid)("unit_tenants_id").references(() => exports.unitTenants.id, {
        onDelete: "cascade",
    }), startDate: (0, pg_core_1.date)("start_date").notNull(), endDate: (0, pg_core_1.date)("end_date").notNull(), monthlyRate: (0, pg_core_1.decimal)("monthly_rate", { precision: 10, scale: 2 }).notNull(), document: (0, pg_core_1.text)("document"), status: (0, pg_core_1.text)("status").notNull(), signature: (0, pg_core_1.boolean)("signature").default(false), signedAt: (0, pg_core_1.timestamp)("signed_at", { withTimezone: true, mode: "date" }) }, exports.timestamps));
exports.parkingPermits = (0, pg_core_1.pgTable)("parking_permits", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.userId, {
        onDelete: "cascade",
    }), guestName: (0, pg_core_1.text)("guest_name"), licensePlate: (0, pg_core_1.varchar)("license_plate", { length: 20 }).notNull(), parkingSpace: (0, pg_core_1.integer)("parking_space"), expiresAt: (0, pg_core_1.timestamp)("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull() }, exports.timestamps));
exports.parkingSpaces = (0, pg_core_1.pgTable)("parking_spaces", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), parkingSpace: (0, pg_core_1.integer)("parking_space").notNull(), status: (0, pg_core_1.text)("status").notNull(), tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, {
        onDelete: "cascade",
    }), expiresAt: (0, pg_core_1.timestamp)("expires_at", { withTimezone: true, mode: "date" }) }, exports.timestamps));
exports.maintenanceRequests = (0, pg_core_1.pgTable)("maintenance_requests", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, {
        onDelete: "cascade",
    }), unitId: (0, pg_core_1.uuid)("unit_id").references(() => exports.units.id, { onDelete: "cascade" }), issueType: (0, exports.issueTypeEnum)("issue_type").notNull(), description: (0, pg_core_1.text)("description").notNull(), status: (0, exports.maintenanceStatusEnum)("status").default("open"), resolution: (0, pg_core_1.text)("resolution"), completedAt: (0, pg_core_1.timestamp)("completed_at", { withTimezone: true, mode: "date" }) }, exports.timestamps));
exports.complaints = (0, pg_core_1.pgTable)("complaints", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, {
        onDelete: "cascade",
    }), issueType: (0, exports.complaintTypeEnum)("issue_type").notNull(), complaintCategory: (0, exports.complaintCategoryEnum)("complaint_category").notNull(), complaintTitle: (0, pg_core_1.text)("complaint_title").notNull(), description: (0, pg_core_1.text)("description").notNull(), priority: (0, pg_core_1.text)("priority").notNull(), resolvedAt: (0, pg_core_1.timestamp)("resolved_at", { withTimezone: true, mode: "date" }) }, exports.timestamps));
exports.accessCodes = (0, pg_core_1.pgTable)("access_codes", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, {
        onDelete: "cascade",
    }), type: (0, exports.accessCodeTypeEnum)("type").notNull(), hashedCode: (0, pg_core_1.varchar)("hashed_code", { length: 255 }).notNull(), expiresAt: (0, pg_core_1.timestamp)("expires_at", { withTimezone: true, mode: "date" }), isActive: (0, pg_core_1.boolean)("is_active").default(true) }, exports.timestamps));
exports.smartLockers = (0, pg_core_1.pgTable)("smart_lockers", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), buildingId: (0, pg_core_1.uuid)("building_id").references(() => exports.buildings.id, {
        onDelete: "cascade",
    }), lockerNumber: (0, pg_core_1.integer)("locker_number").notNull(), isOccupied: (0, pg_core_1.boolean)("is_occupied").default(false) }, exports.timestamps));
exports.packages = (0, pg_core_1.pgTable)("packages", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => exports.tenants.id, {
        onDelete: "cascade",
    }), lockerId: (0, pg_core_1.uuid)("locker_id").references(() => exports.smartLockers.id), lockerCode: (0, pg_core_1.varchar)("locker_code", { length: 10 }), status: (0, exports.packageStatusEnum)("status").default("delivered"), deliveryTime: (0, pg_core_1.timestamp)("delivery_time", {
        withTimezone: true,
        mode: "date",
    }) }, exports.timestamps));
// Table Relations
exports.buildingsRelations = (0, drizzle_orm_1.relations)(exports.buildings, ({ many }) => ({
    units: many(exports.units),
    smartLockers: many(exports.smartLockers),
}));
exports.unitsRelations = (0, drizzle_orm_1.relations)(exports.units, ({ one, many }) => ({
    building: one(exports.buildings, {
        fields: [exports.units.buildingId],
        references: [exports.buildings.id],
    }),
    unitTenants: many(exports.unitTenants),
    maintenanceRequests: many(exports.maintenanceRequests),
}));
exports.tenantsRelations = (0, drizzle_orm_1.relations)(exports.tenants, ({ many }) => ({
    unitTenants: many(exports.unitTenants),
    parkingPermits: many(exports.parkingPermits),
    maintenanceRequests: many(exports.maintenanceRequests),
    complaints: many(exports.complaints),
    accessCodes: many(exports.accessCodes),
    packages: many(exports.packages),
}));
exports.unitTenantsRelations = (0, drizzle_orm_1.relations)(exports.unitTenants, ({ one, many }) => ({
    tenant: one(exports.tenants, {
        fields: [exports.unitTenants.tenantId],
        references: [exports.tenants.id],
    }),
    unit: one(exports.units, {
        fields: [exports.unitTenants.unitId],
        references: [exports.units.id],
    }),
    leases: many(exports.leases),
}));
exports.leasesRelations = (0, drizzle_orm_1.relations)(exports.leases, ({ one }) => ({
    unitTenant: one(exports.unitTenants, {
        fields: [exports.leases.unitTenantsId],
        references: [exports.unitTenants.id],
    }),
}));
exports.maintenanceRequestsRelations = (0, drizzle_orm_1.relations)(exports.maintenanceRequests, ({ one }) => ({
    unit: one(exports.units, {
        fields: [exports.maintenanceRequests.unitId],
        references: [exports.units.id],
    }),
    tenant: one(exports.tenants, {
        fields: [exports.maintenanceRequests.tenantId],
        references: [exports.tenants.id],
    }),
}));
exports.smartLockersRelations = (0, drizzle_orm_1.relations)(exports.smartLockers, ({ one, many }) => ({
    building: one(exports.buildings, {
        fields: [exports.smartLockers.buildingId],
        references: [exports.buildings.id],
    }),
    packages: many(exports.packages),
}));
exports.packagesRelations = (0, drizzle_orm_1.relations)(exports.packages, ({ one }) => ({
    tenant: one(exports.tenants, {
        fields: [exports.packages.tenantId],
        references: [exports.tenants.id],
    }),
    smartLocker: one(exports.smartLockers, {
        fields: [exports.packages.lockerId],
        references: [exports.smartLockers.id],
    }),
}));
