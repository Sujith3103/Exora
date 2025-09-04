import { useQuery } from "@tanstack/react-query";
import server from "@/api/axiosinstance";

interface CourseTabData {
  thumbnailUrl: string;
  title: string;
  pricing: number;
  instructor: {
    name: string;
  } | null;
}

export const useTrending = (category: string) =>
  useQuery({
    queryKey: ["courses", "trending", category],
    queryFn: async () => {
      const { data } = await server.get(`/track-click/trending/${category}`)
      return data.trendingList as CourseTabData[];
    },
  });

export const usePopular = (category: string) =>
  useQuery({
    queryKey: ["courses", "popular", category],
    queryFn: async () => {
      const { data } = await server.get(`/courses/popular?category=${category}`);
      return data as CourseTabData[];
    },
  });

export const useNew = (category: string) =>
  useQuery({
    queryKey: ["courses", "new", category],
    queryFn: async () => {
      const { data } = await server.get(`/courses/new?category=${category}`);
      return data as CourseTabData[];
    },
  });