import React, { createContext, useReducer, useMemo, useEffect } from 'react';

export const MemberContext = createContext();

const initialState = {
  members: [],
  attendance: {}, // { [date]: { [memberId]: true/false } }
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_MEMBERS':
      // Ensure payload is always an array
      const membersArray = Array.isArray(action.payload) ? action.payload : [];
      return { ...state, members: membersArray, loading: false, error: null };
    case 'SET_ATTENDANCE':
      return { ...state, attendance: action.payload };
    case 'UPDATE_MEMBER': {
      const updated = state.members.map((m) =>
        m._id === action.payload.id ? { ...m, ...action.payload.data } : m
      );
      return { ...state, members: updated };
    }
    case 'ADD_MEMBER': {
      return { ...state, members: [action.payload, ...state.members] };
    }
    case 'DELETE_MEMBER': {
      return {
        ...state,
        members: state.members.filter((m) => m._id !== action.payload),
      };
    }
    case 'REPLACE_MEMBER': {
      // Replace a member by _id
      const updated = state.members.map((m) =>
        m._id === action.payload._id ? action.payload : m
      );
      return { ...state, members: updated };
    }
    case 'UPDATE_ATTENDANCE': {
      const { date, memberId, present } = action.payload;
      const dayAttendance = { ...(state.attendance[date] || {}) };
      dayAttendance[memberId] = present;
      return {
        ...state,
        attendance: {
          ...state.attendance,
          [date]: dayAttendance,
        },
      };
    }
    default:
      return state;
  }
}

export const MemberProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // API base URL
  const API_BASE = 'http://localhost:4000/api';

  // Fetch members from backend on mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log('MemberContext: Starting fetch members...');
        dispatch({ type: 'SET_LOADING', payload: true });

        const headers = getAuthHeaders();
        console.log('MemberContext: Request headers:', headers);

        const response = await fetch(`${API_BASE}/members`, {
          headers: headers,
        });

        console.log('MemberContext: Response status:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized access to members. Please log in.');
            dispatch({
              type: 'SET_ERROR',
              payload: 'Unauthorized access. Please log in again.',
            });
            // Optionally redirect to login
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('MemberContext: Fetched members from API:', data);

        // Handle both {data: [...]} and direct array responses
        const members = data.data || data;
        console.log('MemberContext: Processed members:', members);
        dispatch({ type: 'SET_MEMBERS', payload: members });
      } catch (error) {
        console.error('MemberContext: Failed to fetch members:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    fetchMembers();
  }, []);

  // Add member to backend
  const addMember = async (memberData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Adding member to backend:', memberData);

      const response = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || 'Failed to add member'
        );
      }

      const data = await response.json();
      console.log('Member added successfully:', data);

      // Handle response structure
      const newMember = data.data || data;
      dispatch({ type: 'ADD_MEMBER', payload: newMember });
      dispatch({ type: 'SET_LOADING', payload: false });

      return newMember;
    } catch (error) {
      console.error('Error adding member:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Update member in backend
  const updateMember = async (id, memberData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Updating member in backend:', { id, memberData });

      const response = await fetch(`${API_BASE}/members/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || 'Failed to update member'
        );
      }

      const data = await response.json();
      console.log('Member updated successfully:', data);

      const updatedMember = data.data || data;
      dispatch({ type: 'REPLACE_MEMBER', payload: updatedMember });
      dispatch({ type: 'SET_LOADING', payload: false });

      return updatedMember;
    } catch (error) {
      console.error('Error updating member:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Delete member from backend
  const deleteMember = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Deleting member from backend:', id);

      const response = await fetch(`${API_BASE}/members/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || 'Failed to delete member'
        );
      }

      console.log('Member deleted successfully');
      dispatch({ type: 'DELETE_MEMBER', payload: id });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error deleting member:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Mark attendance in backend
  const markAttendance = async (memberId) => {
    try {
      console.log('Marking attendance for member:', memberId);

      const response = await fetch(
        `${API_BASE}/attendance/${memberId}/attendance`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || 'Failed to mark attendance'
        );
      }

      const data = await response.json();
      console.log('Attendance marked successfully:', data);

      // Update the member in our state with the new attendance data
      if (data.data && data.data.member) {
        dispatch({ type: 'REPLACE_MEMBER', payload: data.data.member });
      }

      return data;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  };

  // Memoize context value
  const value = useMemo(
    () => ({
      members: state.members,
      attendance: state.attendance,
      loading: state.loading,
      error: state.error,
      dispatch,
      addMember,
      updateMember,
      deleteMember,
      markAttendance,
    }),
    [state.members, state.attendance, state.loading, state.error]
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
};
