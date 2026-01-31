"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib";
import { Prisma, Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, { message: "Must be lowercase letter without space" }),
  description: z.string().min(10),
});

type CreateTopicFormState = {
  errors: {
    name?: string[];
    description?: string[];
    formError?: string[];
  };
};

export const createTopics = async (
  prevState: CreateTopicFormState,
  formData: FormData,
): Promise<CreateTopicFormState> => {
  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth(); // user must be login

  if (!session || !session.user) {
    return {
      errors: {
        formError: ["You have to login first!"],
      },
    };
  }

  // Prevent duplicate topics by slug (name)
  const existing = await prisma.topic.findUnique({
    where: { slug: result.data.name },
  });

  if (existing) {
    return {
      errors: {
        formError: ["Topic already exists with this name"],
      },
    };
  }

  let topic: Topic; // from prisma client
  try {
    topic=await prisma.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        errors: {
          formError: ["Topic already exists with this name"],
        },
      };
    } else if (error instanceof Error) {
      return {
        errors: {
          formError: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formError: ["Something went wrong"],
        },
      };
    }
  }
  revalidatePath("/");
  redirect(`/topics/${topic.slug}`);
};
