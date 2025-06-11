import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useAtomValue } from 'jotai';
import { selectedModelInfoAtom } from '@/lib/store';

export default function QuestionEvolveButton({ projectId, questionId, onSuccess }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const selectedModelInfo = useAtomValue(selectedModelInfoAtom);

  const handleEvolve = async () => {
    try {
      if (!selectedModelInfo || !selectedModelInfo.id) {
        toast({
          title: t('error'),
          description: t('models.pleaseSelectModel'),
          variant: 'destructive'
        });
        return;
      }

      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/questions/${questionId}/evolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModelInfo,
          language: '中文'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '进化问题失败');
      }

      const result = await response.json();
      toast({
        title: t('success'),
        description: t('question.evolve.success')
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message || t('question.evolve.error'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEvolve}
      disabled={loading || !selectedModelInfo || !selectedModelInfo.id}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('question.evolve.loading')}
        </>
      ) : (
        t('question.evolve.button')
      )}
    </Button>
  );
} 