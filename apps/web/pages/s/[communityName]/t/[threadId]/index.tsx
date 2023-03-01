import { ThreadPage } from 'components/Pages/ThreadPage';
import { GetServerSidePropsContext } from 'next';
import { threadGetServerSideProps } from 'services/threads-ssr';

export default ThreadPage;

//Renders the same page as /threadId
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return threadGetServerSideProps(context, context.query.customDomain === '1');
}
