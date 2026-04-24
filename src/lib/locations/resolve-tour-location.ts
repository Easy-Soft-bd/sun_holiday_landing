import Location from '@/src/models/Location';

type LocInput = {
  locationId?: unknown;
  location?: unknown;
};

/**
 * Resolves `locationId` + denormalized `location` name for tour create/update.
 * Prefers `locationId` when present; otherwise finds or creates a Location by name (legacy).
 */
export async function resolveTourLocationFields(input: LocInput): Promise<{
  locationId: number;
  location: string;
}> {
  const rawId = input.locationId;
  const rawName = input.location;

  if (rawId !== undefined && rawId !== null && rawId !== '') {
    const id = typeof rawId === 'number' ? rawId : Number.parseInt(String(rawId), 10);
    if (!Number.isFinite(id) || id <= 0) {
      throw new Error('Invalid location');
    }
    const loc = await Location.findByPk(id);
    if (!loc) {
      throw new Error('Location not found');
    }
    return { locationId: id, location: loc.name };
  }

  if (typeof rawName === 'string' && rawName.trim()) {
    const name = rawName.trim();
    const [row] = await Location.findOrCreate({
      where: { name },
      defaults: { name },
    });
    return { locationId: row.id, location: row.name };
  }

  throw new Error('Location is required');
}
