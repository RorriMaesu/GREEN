import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { getPlantData } from '../utils/initializeDatabase';

const GardenContext = createContext();

export function useGarden() {
  return useContext(GardenContext);
}

export function GardenProvider({ children }) {
  const [gardens, setGardens] = useState([]);
  const [plants, setPlants] = useState([]);
  const [userPlantings, setUserPlantings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load plants database (static data)
  useEffect(() => {
    async function loadPlants() {
      try {
        // Use our getPlantData function that handles Firestore permission issues
        const plantsList = await getPlantData();
        setPlants(plantsList);
      } catch (error) {
        console.error('Error loading plants:', error);
      }
    }

    loadPlants();
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (!currentUser) {
      setGardens([]);
      setUserPlantings([]);
      setTasks([]);
      setLoading(false);
      return;
    }

    async function loadUserData() {
      setLoading(true);
      try {
        // Load gardens
        const gardensQuery = query(
          collection(db, 'gardens'),
          where('userId', '==', currentUser.uid)
        );
        const gardensSnapshot = await getDocs(gardensQuery);
        const gardensList = gardensSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGardens(gardensList);

        // Load plantings
        const plantingsQuery = query(
          collection(db, 'userPlantings'),
          where('userId', '==', currentUser.uid)
        );
        const plantingsSnapshot = await getDocs(plantingsQuery);
        const plantingsList = plantingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserPlantings(plantingsList);

        // Load tasks
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', currentUser.uid),
          orderBy('dueDate')
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksList = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksList);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [currentUser]);

  // Garden CRUD operations
  async function createGarden(gardenData) {
    try {
      const newGarden = {
        ...gardenData,
        userId: currentUser.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'gardens'), newGarden);
      const garden = { id: docRef.id, ...newGarden };

      setGardens(prev => [...prev, garden]);
      return garden;
    } catch (error) {
      console.error('Error creating garden:', error);
      throw error;
    }
  }

  async function updateGarden(gardenId, gardenData) {
    try {
      const gardenRef = doc(db, 'gardens', gardenId);
      await updateDoc(gardenRef, gardenData);

      setGardens(prev =>
        prev.map(garden =>
          garden.id === gardenId ? { ...garden, ...gardenData } : garden
        )
      );
    } catch (error) {
      console.error('Error updating garden:', error);
      throw error;
    }
  }

  async function deleteGarden(gardenId) {
    try {
      await deleteDoc(doc(db, 'gardens', gardenId));
      setGardens(prev => prev.filter(garden => garden.id !== gardenId));
    } catch (error) {
      console.error('Error deleting garden:', error);
      throw error;
    }
  }

  // Planting CRUD operations
  async function addPlanting(plantingData) {
    try {
      const newPlanting = {
        ...plantingData,
        userId: currentUser.uid,
        datePlanted: new Date(plantingData.datePlanted),
        status: 'active',
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'userPlantings'), newPlanting);
      const planting = { id: docRef.id, ...newPlanting };

      setUserPlantings(prev => [...prev, planting]);

      // Generate initial tasks for this planting
      await generateTasksForPlanting(planting);

      return planting;
    } catch (error) {
      console.error('Error adding planting:', error);
      throw error;
    }
  }

  async function updatePlanting(plantingId, plantingData) {
    try {
      const plantingRef = doc(db, 'userPlantings', plantingId);
      await updateDoc(plantingRef, plantingData);

      setUserPlantings(prev =>
        prev.map(planting =>
          planting.id === plantingId ? { ...planting, ...plantingData } : planting
        )
      );
    } catch (error) {
      console.error('Error updating planting:', error);
      throw error;
    }
  }

  async function deletePlanting(plantingId) {
    try {
      await deleteDoc(doc(db, 'userPlantings', plantingId));
      setUserPlantings(prev => prev.filter(planting => planting.id !== plantingId));

      // Delete associated tasks
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('plantingId', '==', plantingId)
      );
      const tasksSnapshot = await getDocs(tasksQuery);

      const deletePromises = tasksSnapshot.docs.map(doc =>
        deleteDoc(doc.ref)
      );

      await Promise.all(deletePromises);

      setTasks(prev => prev.filter(task => task.plantingId !== plantingId));
    } catch (error) {
      console.error('Error deleting planting:', error);
      throw error;
    }
  }

  // Task operations
  async function generateTasksForPlanting(planting) {
    try {
      // Find the plant details
      const plant = plants.find(p => p.id === planting.plantId);
      if (!plant) return;

      const tasks = [];
      const datePlanted = new Date(planting.datePlanted);

      // Add watering task (recurring)
      const wateringTask = {
        userId: currentUser.uid,
        plantingId: planting.id,
        gardenId: planting.gardenId,
        taskType: 'water',
        dueDate: new Date(datePlanted.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days after planting
        status: 'pending',
        details: `Water your ${plant.name} in ${planting.locationNotes || 'your garden'}`,
        relatedPlantName: plant.name,
        relatedAreaId: planting.areaId,
        notificationSent: false,
        recurring: true,
        recurringDays: plant.wateringNeeds === 'high' ? 2 : (plant.wateringNeeds === 'medium' ? 3 : 5)
      };

      const wateringTaskRef = await addDoc(collection(db, 'tasks'), wateringTask);
      tasks.push({ id: wateringTaskRef.id, ...wateringTask });

      // Add harvest task if applicable
      if (plant.daysToMaturity) {
        const harvestDate = new Date(datePlanted.getTime() + plant.daysToMaturity * 24 * 60 * 60 * 1000);

        const harvestTask = {
          userId: currentUser.uid,
          plantingId: planting.id,
          gardenId: planting.gardenId,
          taskType: 'harvest',
          dueDate: harvestDate,
          status: 'pending',
          details: `Harvest your ${plant.name} from ${planting.locationNotes || 'your garden'}`,
          relatedPlantName: plant.name,
          relatedAreaId: planting.areaId,
          notificationSent: false
        };

        const harvestTaskRef = await addDoc(collection(db, 'tasks'), harvestTask);
        tasks.push({ id: harvestTaskRef.id, ...harvestTask });
      }

      // Add pest check task (recurring)
      const pestCheckTask = {
        userId: currentUser.uid,
        plantingId: planting.id,
        gardenId: planting.gardenId,
        taskType: 'pestCheck',
        dueDate: new Date(datePlanted.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week after planting
        status: 'pending',
        details: `Check ${plant.name} for pests and diseases`,
        relatedPlantName: plant.name,
        relatedAreaId: planting.areaId,
        notificationSent: false,
        recurring: true,
        recurringDays: 14 // Every 2 weeks
      };

      const pestCheckTaskRef = await addDoc(collection(db, 'tasks'), pestCheckTask);
      tasks.push({ id: pestCheckTaskRef.id, ...pestCheckTask });

      setTasks(prev => [...prev, ...tasks]);
      return tasks;
    } catch (error) {
      console.error('Error generating tasks:', error);
      throw error;
    }
  }

  async function completeTask(taskId) {
    try {
      console.log('Completing task:', taskId);
      const taskRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(taskRef);

      if (!taskDoc.exists()) {
        throw new Error('Task not found');
      }

      const taskData = taskDoc.data();
      console.log('Task data:', taskData);

      // Safely get the due date regardless of whether it's a Firestore timestamp or JS date
      let taskDueDate;
      if (taskData.dueDate && typeof taskData.dueDate.toDate === 'function') {
        taskDueDate = taskData.dueDate.toDate();
      } else if (taskData.dueDate) {
        taskDueDate = new Date(taskData.dueDate);
      } else {
        taskDueDate = new Date();
      }

      // Check if task is due today or in the past
      const today = new Date();
      const taskDateString = taskDueDate.toDateString();
      const todayString = today.toDateString();
      const isPastDue = taskDueDate < today && taskDateString !== todayString;
      const isDueToday = taskDateString === todayString;
      
      // Only allow completion if the task is due today or overdue
      if (!isDueToday && !isPastDue) {
        throw new Error('This task cannot be completed yet. It is scheduled for ' + 
          taskDueDate.toLocaleDateString() + '.');
      }

      // Update the task status
      await updateDoc(taskRef, {
        status: 'completed',
        completedAt: new Date()
      });

      // If it's a recurring task, create the next occurrence
      if (taskData.recurring && taskData.recurringDays) {
        const nextDueDate = new Date(taskDueDate.getTime() + taskData.recurringDays * 24 * 60 * 60 * 1000);
        console.log('Creating next occurrence with due date:', nextDueDate);

        const newTask = {
          ...taskData,
          dueDate: nextDueDate,
          status: 'pending',
          notificationSent: false
        };

        delete newTask.id; // Remove the id field before adding

        const newTaskRef = await addDoc(collection(db, 'tasks'), newTask);
        const createdTask = { id: newTaskRef.id, ...newTask };
        console.log('New recurring task created:', createdTask.id);

        // Update local state
        setTasks(prev => [
          ...prev.filter(t => t.id !== taskId),
          { ...prev.find(t => t.id === taskId), status: 'completed', completedAt: new Date() },
          createdTask
        ]);
      } else {
        console.log('Non-recurring task completed');
        // Just update the completed task in state
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId ? { ...task, status: 'completed', completedAt: new Date() } : task
          )
        );
      }
      
      console.log('Task completion process finished');
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  // User data clearing function for account deletion
  async function clearGardenData() {
    try {
      if (!currentUser) return;
      
      // Delete all user gardens
      const gardensQuery = query(
        collection(db, 'gardens'),
        where('userId', '==', currentUser.uid)
      );
      const gardensSnapshot = await getDocs(gardensQuery);
      
      for (const gardenDoc of gardensSnapshot.docs) {
        await deleteDoc(gardenDoc.ref);
      }
      
      // Delete all user plantings
      const plantingsQuery = query(
        collection(db, 'userPlantings'),
        where('userId', '==', currentUser.uid)
      );
      const plantingsSnapshot = await getDocs(plantingsQuery);
      
      for (const plantingDoc of plantingsSnapshot.docs) {
        await deleteDoc(plantingDoc.ref);
      }
      
      // Delete all user tasks
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', currentUser.uid)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      
      for (const taskDoc of tasksSnapshot.docs) {
        await deleteDoc(taskDoc.ref);
      }
      
      // Delete user document
      await deleteDoc(doc(db, 'users', currentUser.uid));
      
      // Clear local state
      setGardens([]);
      setUserPlantings([]);
      setTasks([]);
      
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }

  const value = {
    gardens,
    plants,
    userPlantings,
    tasks,
    loading,
    createGarden,
    updateGarden,
    deleteGarden,
    addPlanting,
    updatePlanting,
    deletePlanting,
    completeTask,
    clearGardenData
  };

  return (
    <GardenContext.Provider value={value}>
      {children}
    </GardenContext.Provider>
  );
}
