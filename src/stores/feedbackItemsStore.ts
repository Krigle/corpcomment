import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

interface Store {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  selectCompany: (company: string) => void;
  isSelected: (company: string) => boolean;
  fetchFeedbackItems: () => Promise<void>;
}

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  getCompanyList: () => {
    const state = get();
    return state.feedbackItems
      .map((item) => item.company)
      .filter((company, index, array) => array.indexOf(company) === index);
  },
  getFilteredFeedbackItems: () => {
    const state = get();
    return state.selectedCompany
      ? state.feedbackItems.filter(
          (feedbackItem) => feedbackItem.company === state.selectedCompany
        )
      : state.feedbackItems;
  },
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);

    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
    };

    set((state) => ({
      feedbackItems: [...state.feedbackItems, newItem],
    }));

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  selectCompany: (company: string) => {
    set((state) => ({
      ...state,
      selectedCompany: company,
    }));
  },
  isSelected: (company: string) => {
    const state = get();
    return state.selectedCompany === company;
  },
  fetchFeedbackItems: async () => {
    set((state) => ({
      ...state,
      isLoading: true,
    }));

    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      set((state) => ({
        ...state,
        feedbackItems: data.feedbacks,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        errorMessage: "Something went wrong. Please try again later.",
      }));
    }

    set((state) => ({
      ...state,
      isLoading: false,
    }));
  },
}));
