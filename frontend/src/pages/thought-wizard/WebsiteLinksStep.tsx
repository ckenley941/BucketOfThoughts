import {
  Box,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../../services/api';
import type { ThoughtWebsiteLink } from '../../types';

interface LocalThoughtWebsiteLink extends Omit<ThoughtWebsiteLink, 'websiteLinkId'> {
  websiteLinkId: number | string;
  isNew?: boolean;
}

export interface WebsiteLinksStepHandle {
  save: () => Promise<void>;
  getLinks: () => LocalThoughtWebsiteLink[];
}

interface WebsiteLinksStepProps {
  thoughtId: number;
  onLinksChange?: (links: LocalThoughtWebsiteLink[]) => void;
}

const WebsiteLinksStep = forwardRef<WebsiteLinksStepHandle, WebsiteLinksStepProps>(
  ({ thoughtId, onLinksChange }, ref) => {
    const apiClient = useApiClient();
    const { isAuthenticated } = useAuth0();
    const [links, setLinks] = useState<LocalThoughtWebsiteLink[]>([]);
    const [originalLinkIds, setOriginalLinkIds] = useState<Array<{ thoughtId: number; websiteLinkId: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextTempId, setNextTempId] = useState(-1);
    const [draggedLinkId, setDraggedLinkId] = useState<number | string | null>(null);

    useEffect(() => {
      if (!isAuthenticated || !thoughtId) {
        setLoading(false);
        return;
      }

      const fetchLinks = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get<ThoughtWebsiteLink[]>(
            `api/thoughtwebsitelinks/thought/${thoughtId}`
          );
          const loadedLinks = response.data.map((l) => ({
            ...l,
          }));
          setLinks(loadedLinks);
          setOriginalLinkIds(response.data.map((l) => ({ thoughtId: l.thoughtId, websiteLinkId: l.websiteLinkId })));
          if (onLinksChange) {
            onLinksChange(loadedLinks);
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : 'An error occurred while fetching website links'
          );
        } finally {
          setLoading(false);
        }
      };

      fetchLinks();
    }, [isAuthenticated, thoughtId, apiClient, onLinksChange]);

    const handleAddLink = () => {
      const newLink: LocalThoughtWebsiteLink = {
        thoughtId: thoughtId,
        websiteLinkId: nextTempId,
        websiteUrl: '',
        description: '',
        sortOrder: links.length > 0 ? Math.max(...links.map((l) => l.sortOrder)) + 1 : 1,
        isNew: true,
      };
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      setNextTempId(nextTempId - 1);
      if (onLinksChange) {
        onLinksChange(updatedLinks);
      }
    };

    const handleUpdateLink = (
      id: number | string,
      field: keyof LocalThoughtWebsiteLink,
      value: any
    ) => {
      const updatedLinks = links.map((link) =>
        link.websiteLinkId === id ? { ...link, [field]: value } : link
      );
      setLinks(updatedLinks);
      if (onLinksChange) {
        onLinksChange(updatedLinks);
      }
    };

    const handleDeleteLink = (id: number | string) => {
      const updatedLinks = links.filter((link) => link.websiteLinkId !== id);
      setLinks(updatedLinks);
      if (onLinksChange) {
        onLinksChange(updatedLinks);
      }
    };

    const handleDragStart = (linkId: number | string) => {
      setDraggedLinkId(linkId);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, dropLinkId: number | string) => {
      e.preventDefault();
      if (draggedLinkId === null || draggedLinkId === dropLinkId) {
        setDraggedLinkId(null);
        return;
      }

      // Sort links by sortOrder first
      const sortedLinks = [...links].sort((a, b) => a.sortOrder - b.sortOrder);
      
      // Find the dragged item and drop target indices
      const draggedIndex = sortedLinks.findIndex((l) => l.websiteLinkId === draggedLinkId);
      const dropIndex = sortedLinks.findIndex((l) => l.websiteLinkId === dropLinkId);
      
      if (draggedIndex === -1 || dropIndex === -1 || draggedIndex === dropIndex) {
        setDraggedLinkId(null);
        return;
      }
      
      // Remove dragged item from its position
      const draggedItem = sortedLinks[draggedIndex];
      const newLinks = sortedLinks.filter((_, index) => index !== draggedIndex);
      
      // Insert at new position (adjust index if dragging down)
      const finalDropIndex = dropIndex > draggedIndex ? dropIndex - 1 : dropIndex;
      newLinks.splice(finalDropIndex, 0, draggedItem);
      
      // Update sort orders sequentially starting from 1
      const reorderedLinks = newLinks.map((link, index) => ({
        ...link,
        sortOrder: index + 1,
      }));

      setLinks(reorderedLinks);
      setDraggedLinkId(null);
      if (onLinksChange) {
        onLinksChange(reorderedLinks);
      }
    };

    const handleDragEnd = () => {
      setDraggedLinkId(null);
    };

    const handleSaveAll = async () => {
      setError(null);
      if (!isAuthenticated) {
        setError('You must be logged in to save website links.');
        throw new Error('You must be logged in to save website links.');
      }

      // Filter out invalid links (no websiteUrl or sort order <= 0)
      const validLinks = links.filter(
        (l) => l.websiteUrl.trim() && l.sortOrder > 0
      );

      // Remove invalid links from state
      if (validLinks.length !== links.length) {
        setLinks(validLinks);
        if (onLinksChange) {
          onLinksChange(validLinks);
        }
      }

      // If no valid links, just return
      if (validLinks.length === 0) {
        return;
      }

      // Check for duplicate sort orders
      const sortOrders = validLinks.map((l) => l.sortOrder);
      const duplicateSortOrders = sortOrders.filter(
        (order, index) => sortOrders.indexOf(order) !== index
      );
      
      if (duplicateSortOrders.length > 0) {
        const errorMessage = `Duplicate sort orders found. Please ensure each link has a unique sort order. Duplicate values: ${[...new Set(duplicateSortOrders)].join(', ')}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      setSaving(true);
      try {
        // Find links that were deleted
        const currentLinkIds = validLinks
          .filter((l) => !l.isNew)
          .map((l) => ({ thoughtId: l.thoughtId, websiteLinkId: l.websiteLinkId as number }));
        const deletedLinks = originalLinkIds.filter(
          (id) => !currentLinkIds.some((cid) => cid.thoughtId === id.thoughtId && cid.websiteLinkId === id.websiteLinkId)
        );

        // Delete removed links
        const deletePromises = deletedLinks.map((id) =>
          apiClient.delete(`api/thoughtwebsitelinks/thought/${id.thoughtId}/websiteLink/${id.websiteLinkId}`)
        );

        // Save all valid links
        const savePromises = validLinks.map(async (link) => {
          const payload: Partial<ThoughtWebsiteLink> = {
            thoughtId: link.thoughtId,
            websiteLinkId: link.isNew ? 0 : (link.websiteLinkId as number),
            websiteUrl: link.websiteUrl.trim(),
            description: link.description?.trim() || undefined,
            sortOrder: link.sortOrder,
          };

          if (link.isNew) {
            await apiClient.post<ThoughtWebsiteLink>('api/thoughtwebsitelinks', payload);
          } else {
            await apiClient.put<ThoughtWebsiteLink>('api/thoughtwebsitelinks', payload);
          }
        });

        await Promise.all([...deletePromises, ...savePromises]);

        // Reload links to get updated IDs
        const response = await apiClient.get<ThoughtWebsiteLink[]>(
          `api/thoughtwebsitelinks/thought/${thoughtId}`
        );
        const reloadedLinks = response.data.map((l) => ({
          ...l,
        }));
        setLinks(reloadedLinks);
        setOriginalLinkIds(response.data.map((l) => ({ thoughtId: l.thoughtId, websiteLinkId: l.websiteLinkId })));
        if (onLinksChange) {
          onLinksChange(reloadedLinks);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while saving website links'
        );
        throw err;
      } finally {
        setSaving(false);
      }
    };

    // Expose save function via ref
    useImperativeHandle(ref, () => ({
      save: handleSaveAll,
      getLinks: () => links,
    }));

    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <IconButton
            color="primary"
            onClick={handleAddLink}
            disabled={saving}
            title="Add Website Link"
          >
            <AddIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {links.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ typography: 'body1', color: 'text.secondary' }}>
              No website links yet. Click the + icon to add a link.
            </Box>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {links
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((link) => (
                <Paper
                  key={link.websiteLinkId}
                  sx={{
                    p: 2,
                    cursor: 'move',
                    opacity: draggedLinkId === link.websiteLinkId ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                  }}
                  draggable
                  onDragStart={() => handleDragStart(link.websiteLinkId)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, link.websiteLinkId)}
                  onDragEnd={handleDragEnd}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <DragIndicatorIcon
                      sx={{
                        color: 'text.secondary',
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                      }}
                    />
                    <TextField
                      label="Sort Order"
                      type="number"
                      value={link.sortOrder}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value) && value > 0) {
                          handleUpdateLink(link.websiteLinkId, 'sortOrder', value);
                        }
                      }}
                      inputProps={{ min: 1 }}
                      sx={{ width: 120 }}
                      size="small"
                      error={link.sortOrder <= 0}
                      helperText={
                        link.sortOrder <= 0 ? 'Must be greater than 0' : ''
                      }
                    />
                    <TextField
                      label="Website URL"
                      value={link.websiteUrl}
                      onChange={(e) =>
                        handleUpdateLink(link.websiteLinkId, 'websiteUrl', e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Description"
                      value={link.description || ''}
                      onChange={(e) =>
                        handleUpdateLink(link.websiteLinkId, 'description', e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteLink(link.websiteLinkId)}
                      title="Delete Link"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
          </Box>
        )}
      </Box>
    );
  }
);

WebsiteLinksStep.displayName = 'WebsiteLinksStep';

export default WebsiteLinksStep;
