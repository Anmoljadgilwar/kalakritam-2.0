import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../contexts/UserAuthContext';
import { validateUsernameMatch, getUserPath } from '../../utils/userHelpers';
import { toast } from '../../utils/notifications';

/**
 * Hook to validate username in URL matches the logged-in user
 * Redirects to correct path if mismatch detected
 * @param {string} pageName - Name of the current page (e.g., 'gallery', 'workshops')
 */
export const useUsernameValidation = (pageName = 'home') => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();

  useEffect(() => {
    if (username && user) {
      const isValid = validateUsernameMatch(username, user);
      if (!isValid) {
        toast.error('Access denied. Redirecting to your page...');
        const correctPath = getUserPath(user, pageName);
        navigate(correctPath, { replace: true });
      }
    }
  }, [username, user, navigate, pageName]);
};

export default useUsernameValidation;
