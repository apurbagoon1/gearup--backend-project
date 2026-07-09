import { prisma } from "../../lib/prisma";

const getDashboard = async (providerId: string) => {
  const [
    totalGear,
    availableGear,
    totalOrders,
    pendingOrders,
    returnedOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.gear.count({
      where: {
        providerId,
      },
    }),

    prisma.gear.count({
      where: {
        providerId,
        isAvailable: true,
      },
    }),

    prisma.rentalOrder.count({
      where: {
        gear: {
          providerId,
        },
      },
    }),

    prisma.rentalOrder.count({
      where: {
        gear: {
          providerId,
        },
        status: "PLACED",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        gear: {
          providerId,
        },
        status: "RETURNED",
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        rentalOrder: {
          gear: {
            providerId,
          },
        },
      },

      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalGear,

    availableGear,

    totalOrders,

    pendingOrders,

    returnedOrders,

    totalRevenue: totalRevenue._sum.amount ?? 0,
  };
};

const getIncomingOrders = async (
  providerId: string,
  query: {
    status?: string;
    page?: string;
    limit?: string;
  },
) => {
  const { status, page = "1", limit = "10" } = query;

  const currentPage = Number(page);
  const perPage = Number(limit);

  const skip = (currentPage - 1) * perPage;
  const where: any = {
    gear: {
      providerId,
    },
  };

  if (status) {
    where.status = status;
  }

  const [orders, totalOrders] = await Promise.all([
    prisma.rentalOrder.findMany({
      where,

      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        gear: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },

        payment: true,
      },

      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: perPage,
    }),

    prisma.rentalOrder.count({
      where,
    }),
  ]);

  return {
    meta: {
      page: currentPage,
      limit: perPage,
      total: totalOrders,
      totalPage: Math.ceil(totalOrders / perPage),
    },

    data: orders,
  };
};

export const ProviderService = {
  getDashboard,
  getIncomingOrders,
};
