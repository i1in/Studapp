import { AppLayout } from '../../components/shared/app-layout/app-layout';

function NotFound() {
    return (
        <>
            <AppLayout title="WTF?">
                <div className="page__404">
                    <section className="not-found">
                        <p className="not-found__title">404</p>
                        <p className="not-found__subtitle">
                            Страница не найдена
                        </p>
                        <p className="not-found__text">
                            Страница, которую вы ищете, куда-то исчезла, и мы не
                            собираемся её искать.
                        </p>
                        <a className="not-found__link button" href="/feed">
                            На главную
                        </a>
                    </section>
                </div>
            </AppLayout>
        </>
    );
}

export default NotFound;
