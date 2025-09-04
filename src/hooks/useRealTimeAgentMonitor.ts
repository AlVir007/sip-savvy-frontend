// Create src/hooks/useRealTimeAgentMonitor.ts
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface AgentExecution {
  id: string;
  agent_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  output_data?: any;
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  success_rate: number;
  execution_count: number;
  last_execution: string | null;
  tasks_created_today: number;
  recent_executions: AgentExecution[];
}

export const useRealTimeAgentMonitor = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Fetch agents data
  const fetchAgents = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/agents');
      setAgents(response.data.agents || []);
      setLastUpdateTime(new Date());
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      setError('Failed to fetch agent data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Execute agent manually
  const executeAgent = useCallback(async (agentId: string) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) return;

      toast.loading(`Executing ${agent.name}...`, { id: `execute-${agentId}` });
      
      const response = await api.post(`/agents/${agentId}/execute`);
      
      if (response.data.success) {
        toast.success(`${agent.name} executed successfully!`, { 
          id: `execute-${agentId}` 
        });
        
        // Refresh agents data to get updated execution info
        await fetchAgents();
      } else {
        toast.error(`${agent.name} execution failed: ${response.data.message}`, { 
          id: `execute-${agentId}` 
        });
      }
    } catch (err) {
      console.error('Failed to execute agent:', err);
      toast.error('Failed to execute agent', { id: `execute-${agentId}` });
    }
  }, [agents, fetchAgents]);

  // Update agent status
  const updateAgentStatus = useCallback(async (agentId: string, newStatus: 'active' | 'paused') => {
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) return;

      const response = await api.patch(`/agents/${agentId}/status`, { status: newStatus });
      
      if (response.data.success) {
        toast.success(`${agent.name} ${newStatus === 'active' ? 'activated' : 'paused'}`);
        
        // Update local state immediately for better UX
        setAgents(prev => prev.map(a => 
          a.id === agentId ? { ...a, status: newStatus } : a
        ));
      }
    } catch (err) {
      console.error('Failed to update agent status:', err);
      toast.error('Failed to update agent status');
    }
  }, [agents]);

  // Get agent executions
  const getAgentExecutions = useCallback(async (agentId: string) => {
    try {
      const response = await api.get(`/agents/${agentId}/executions`);
      return response.data.executions || [];
    } catch (err) {
      console.error('Failed to fetch agent executions:', err);
      return [];
    }
  }, []);

  // Check if any agents are currently running
  const hasRunningAgents = agents.some(agent => 
    agent.recent_executions.some(execution => execution.status === 'running')
  );

  // Get agents by type
  const agentsByType = {
    story_discovery: agents.filter(a => a.type === 'story_discovery'),
    persona_content: agents.filter(a => a.type === 'persona_content'),
    editorial_planning: agents.filter(a => a.type === 'editorial_planning'),
  };

  // Calculate stats
  const stats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    executing: agents.filter(a => 
      a.recent_executions.some(e => e.status === 'running')
    ).length,
    totalExecutions: agents.reduce((sum, a) => sum + a.execution_count, 0),
    averageSuccessRate: agents.length > 0 
      ? agents.reduce((sum, a) => sum + a.success_rate, 0) / agents.length 
      : 0,
    tasksCreatedToday: agents.reduce((sum, a) => sum + a.tasks_created_today, 0),
  };

  // Initial fetch
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Auto-refresh when agents are running
  useEffect(() => {
    if (!hasRunningAgents) return;

    const interval = setInterval(() => {
      fetchAgents();
    }, 5000); // Refresh every 5 seconds when agents are running

    return () => clearInterval(interval);
  }, [hasRunningAgents, fetchAgents]);

  // Regular refresh interval (less frequent when no agents running)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAgents();
    }, 30000); // Refresh every 30 seconds normally

    return () => clearInterval(interval);
  }, [fetchAgents]);

  return {
    agents,
    isLoading,
    error,
    lastUpdateTime,
    hasRunningAgents,
    agentsByType,
    stats,
    executeAgent,
    updateAgentStatus,
    getAgentExecutions,
    refetch: fetchAgents,
  };
};