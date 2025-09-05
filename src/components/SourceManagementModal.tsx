import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Source {
  id: string;
  name: string;
  source_type: string;
  category: string;
  subcategory: string;
  url: string;
  feed_url: string;
  status: 'active' | 'quarantined' | 'disabled';
  failure_count: number;
  last_error?: string;
  last_successful_fetch?: string;
}

interface QuarantinedSource extends Source {
  primary_error: string;
  failure_pattern: string;
  suggested_action: string;
}

interface ManualContent {
  title: string;
  content: string;
  source_url: string;
  source_name: string;
  reason: string;
  content_type: string;
}

export const SourceManagementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [quarantinedSources, setQuarantinedSources] = useState<QuarantinedSource[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const [manualContent, setManualContent] = useState<ManualContent>({
    title: '',
    content: '',
    source_url: '',
    source_name: '',
    reason: '',
    content_type: 'article'
  });

  useEffect(() => {
    if (isOpen) {
      fetchSources();
      fetchQuarantinedSources();
    }
  }, [isOpen]);

  const fetchSources = async () => {
    try {
      const response = await api.get('/sources');
      setSources(response.data.sources);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const fetchQuarantinedSources = async () => {
    try {
      const response = await api.get('/sources/quarantined');
      setQuarantinedSources(response.data.quarantined);
    } catch (error) {
      console.error('Error fetching quarantined sources:', error);
    }
  };

  const handleBulkImport = async () => {
    setIsImporting(true);
    try {
      const response = await api.post('/sources/bulk-import', {
        source: 'seedlist' // Import from the predefined seedlist
      });
      setImportResults(response.data);
      toast.success(`Imported ${response.data.successful.length} sources successfully`);
      fetchSources();
      fetchQuarantinedSources();
    } catch (error) {
      console.error('Error importing sources:', error);
      toast.error('Failed to import sources');
    } finally {
      setIsImporting(false);
    }
  };

  const handleManualContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/manual-content', manualContent);
      toast.success('Content submitted for review');
      setManualContent({
        title: '',
        content: '',
        source_url: '',
        source_name: '',
        reason: '',
        content_type: 'article'
      });
    } catch (error) {
      console.error('Error submitting manual content:', error);
      toast.error('Failed to submit content');
    }
  };

  const retryQuarantinedSource = async (sourceId: string) => {
    try {
      await api.post(`/sources/${sourceId}/retry`);
      toast.success('Source retry scheduled');
      fetchQuarantinedSources();
    } catch (error) {
      console.error('Error retrying source:', error);
      toast.error('Failed to retry source');
    }
  };

  const getStatusBadge = (status: string, failureCount: number) => {
    if (status === 'quarantined') {
      return <Badge variant="destructive">Quarantined</Badge>;
    }
    if (failureCount > 0) {
      return <Badge variant="secondary">Issues ({failureCount})</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Source Management & Content Import</DialogTitle>
          <DialogDescription>
            Manage your content sources, import new publications, and handle quarantined feeds.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sources" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sources">Active Sources</TabsTrigger>
            <TabsTrigger value="quarantined">Quarantined</TabsTrigger>
            <TabsTrigger value="import">Bulk Import</TabsTrigger>
            <TabsTrigger value="manual">Manual Submit</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Active Sources ({sources.length})</h3>
              <Button onClick={fetchSources} size="sm">Refresh</Button>
            </div>
            
            <div className="grid gap-4">
              {sources.map((source) => (
                <div key={source.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{source.name}</h4>
                        {getStatusBadge(source.status, source.failure_count)}
                        <Badge variant="outline">{source.source_type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {source.category} • {source.subcategory}
                      </p>
                      <p className="text-sm text-blue-600 truncate">
                        {source.feed_url || source.url}
                      </p>
                      {source.last_error && (
                        <p className="text-sm text-red-600 mt-2">
                          Last Error: {source.last_error}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {source.last_successful_fetch && (
                        <p>Last Success: {new Date(source.last_successful_fetch).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quarantined" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Quarantined Sources ({quarantinedSources.length})</h3>
              <Button onClick={fetchQuarantinedSources} size="sm">Refresh</Button>
            </div>

            {quarantinedSources.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No sources are currently quarantined. All sources are accessible!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4">
                {quarantinedSources.map((source) => (
                  <div key={source.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{source.name}</h4>
                          <Badge variant="destructive">{source.primary_error}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {source.category} • {source.subcategory}
                        </p>
                        <p className="text-sm text-blue-600 truncate mb-2">
                          {source.feed_url || source.url}
                        </p>
                        <div className="text-sm space-y-1">
                          <p><strong>Pattern:</strong> {source.failure_pattern}</p>
                          <p><strong>Suggested Action:</strong> {source.suggested_action}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => retryQuarantinedSource(source.id)}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bulk Source Import</h3>
              
              <Alert>
                <AlertDescription>
                  Import the curated seedlist of HoReCa & Drinks publications. 
                  The system will test each source and quarantine any that are unreachable.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleBulkImport}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? 'Importing Sources...' : 'Import Seedlist (116 Sources)'}
              </Button>

              {importResults && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {importResults.successful.length}
                    </div>
                    <div className="text-sm text-green-700">Successful</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {importResults.failed.length}
                    </div>
                    <div className="text-sm text-yellow-700">Failed</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {importResults.quarantined.length}
                    </div>
                    <div className="text-sm text-red-700">Quarantined</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {importResults.manual_required.length}
                    </div>
                    <div className="text-sm text-blue-700">Manual Review</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Submit Content Manually</h3>
              
              <Alert>
                <AlertDescription>
                  Found interesting content from a source our agents can't access? 
                  Submit it here for editorial review and potential inclusion.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleManualContentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Article Title</Label>
                    <Input
                      id="title"
                      value={manualContent.title}
                      onChange={(e) => setManualContent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter article title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="source_name">Source Publication</Label>
                    <Input
                      id="source_name"
                      value={manualContent.source_name}
                      onChange={(e) => setManualContent(prev => ({ ...prev, source_name: e.target.value }))}
                      placeholder="e.g., Wine Spectator"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="source_url">Source URL</Label>
                  <Input
                    id="source_url"
                    type="url"
                    value={manualContent.source_url}
                    onChange={(e) => setManualContent(prev => ({ ...prev, source_url: e.target.value }))}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content/Summary</Label>
                  <Textarea
                    id="content"
                    value={manualContent.content}
                    onChange={(e) => setManualContent(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Paste article text or write a summary of key points..."
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reason">Submission Reason</Label>
                  <Textarea
                    id="reason"
                    value={manualContent.reason}
                    onChange={(e) => setManualContent(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Why is this content relevant? Why can't our agents access it?"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit for Review
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};