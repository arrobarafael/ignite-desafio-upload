import { Button, Box } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const [hasMorePages, setHasMorePages] = useState(false);

  const fetchProjects = async ({ pageParam = 0 }) => {
    const fetchData = await api.get(`/api/images`, {
      params: {
        after: pageParam,
      },
    });
    return fetchData;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM**********
    fetchProjects,
    // TODO GET AND RETURN NEXT PAGE PARAM**********
    {
      getNextPageParam: lastPage => lastPage.data.after ?? null,
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    if (data?.pages) {
      setHasMorePages(!!data.pages[data.pages.length - 1].data.after);

      const formatado = data.pages
        .map(pages => {
          return pages.data.data.map(reg => {
            return reg;
          });
        })
        .flat();
      return formatado;
    }
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasMorePages && (
          <Button
            mt={10}
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            loadingText="Carregando..."
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
