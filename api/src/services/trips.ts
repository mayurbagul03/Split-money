import { randomBytes } from "node:crypto";
import { prisma } from "../db.js";
import { HttpError, notFound } from "../lib/httpError.js";
import type { CreateTripInput } from "../schemas/trip.js";

const membersInOrder = {
  members: {
    orderBy: [{ createdAt: "asc" as const }, { name: "asc" as const }],
  },
};

function newInviteCode(): string {
  return randomBytes(6).toString("base64url"); // 8 URL-safe characters
}

export async function listTrips() {
  return prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { members: true, expenses: true } } },
  });
}

export async function createTrip(input: CreateTripInput) {
  return prisma.trip.create({
    data: {
      name: input.name,
      currency: input.currency,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      inviteCode: newInviteCode(),
      members: { create: input.members.map((name) => ({ name })) },
    },
    include: membersInOrder,
  });
}

export async function getTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: membersInOrder,
  });
  if (!trip) {
    throw notFound("Trip");
  }
  return trip;
}

export async function addMember(tripId: string, name: string) {
  const trip = await getTrip(tripId);

  const taken = trip.members.some(
    (m) => m.name.toLowerCase() === name.toLowerCase(),
  );
  if (taken) {
    throw new HttpError(
      400,
      `${name} is already on this trip.`.replace("400", "409"),
    );
  }

  return prisma.member.create({ data: { tripId, name } });
}
