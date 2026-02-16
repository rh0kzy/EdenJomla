import { useSnackbar, VariantType } from 'notistack';

export function useToast() {
  const { enqueueSnackbar } = useSnackbar();

  function toast(message: string, variant: VariantType = 'default') {
    enqueueSnackbar(message, { variant });
  }

  return { toast };
}
