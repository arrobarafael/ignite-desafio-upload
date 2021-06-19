import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchProjects = async ({ pageParam = 0 }) => {
    const fetchData = await api.get(`/api/images`, {
      params: {
        after: pageParam,
      },
    });

    // console.log(fetchData);
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
      getNextPageParam: lastPage => lastPage.after ?? null,
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    if (data?.pages) {
      console.log('data');
      console.log(data);
      return data.pages[0].data.data.map(dog => dog);
    }
    console.log('has next page? ', hasNextPage);
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
        <Button mt={10} onClick={() => fetchNextPage()}>
          Carregar mais
        </Button>
      </Box>
    </>
  );
}
