'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../store/productSlice';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

export default function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      // Fetch User
      try {
        const userData = await fetchUserDetails();
        if (userData?.data && isMounted) {
          dispatch(setUserDetails(userData.data));
        }
      } catch (error) {
        console.error("User fetch failed:", error);
        toast.error("Failed to fetch user details");
      }

      // Fetch Categories
      try {
        dispatch(setLoadingCategory(true));
        const categoryResponse = await Axios(SummaryApi.getCategory);
        if (categoryResponse.data.success && isMounted) {
          dispatch(
            setAllCategory(
              categoryResponse.data.data.sort((a, b) => a.name.localeCompare(b.name))
            )
          );
        }
      } catch (error) {
        console.error("Category fetch failed:", error);
        toast.error("Failed to fetch categories");
      } finally {
        if (isMounted) dispatch(setLoadingCategory(false));
      }

      // Fetch Sub-Categories
      try {
        const subCategoryResponse = await Axios(SummaryApi.getSubCategory);
        if (subCategoryResponse.data.success && isMounted) {
          dispatch(
            setAllSubCategory(
              subCategoryResponse.data.data.sort((a, b) => a.name.localeCompare(b.name))
            )
          );
        }
      } catch (error) {
        console.error("Sub-category fetch failed:", error);
        toast.error("Failed to fetch sub-categories");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return null;
}