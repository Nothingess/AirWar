import { ISceneFacade } from "../Scenes/ISceneFacade";

export class ISystem {
    protected mFacade: ISceneFacade = null;
    public getFacade(): ISceneFacade { return this.mFacade }

    public initSys(iFacade: ISceneFacade): void {
        this.mFacade = iFacade;
    }
    public rendererUpdate(dt): void { }
    public logicUpdate(dt): void { }
    public endSys(): void { }

}
